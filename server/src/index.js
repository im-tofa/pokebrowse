const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const { DateTimeResolver } = require("graphql-scalars");
// const https = require("https");
const fs = require("fs");
const path = require("path");
// const httpsOptions = {
//   key: fs.readFileSync(path.join(__dirname, "..", "configs", "key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "..", "configs", "cert.pem")),
// };

const client_url = process.env.CLIENT_URL || "http://localhost:8080";
// TODO: use helmet middleware to force https? not necessary though idt

/* ENV VARIABLE SETUP */
require("dotenv").config({
  path: path.join(__dirname, "..", "configs", ".env"),
});

/* DATABASE SETUP */
const { Pool, Client } = require("pg");
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { ca: process.env.CA_CERT },
    })
  : new Pool();

const pokedex = require("./pkmnstats");
const { natures } = require("./utils/ps-utils");

const PORT = process.env.PORT || 3000;

const evType = new GraphQLObjectType({
  name: "EVs",
  fields: () => ({
    hp: { type: GraphQLInt },
    atk: { type: GraphQLInt },
    def: { type: GraphQLInt },
    spa: { type: GraphQLInt },
    spd: { type: GraphQLInt },
    spe: { type: GraphQLInt },
  }),
});

const ivType = new GraphQLObjectType({
  name: "IVs",
  fields: () => ({
    hp: { type: GraphQLInt },
    atk: { type: GraphQLInt },
    def: { type: GraphQLInt },
    spa: { type: GraphQLInt },
    spd: { type: GraphQLInt },
    spe: { type: GraphQLInt },
  }),
});

const setType = new GraphQLObjectType({
  name: "Set",
  fields: () => ({
    set_id: { type: GraphQLInt },
    species: { type: GraphQLString },
    author: { type: GraphQLString },
    name: { type: GraphQLString },
    level: { type: GraphQLInt },
    ability: { type: GraphQLString },
    item: { type: GraphQLString },
    nature: { type: GraphQLString },
    description: { type: GraphQLString },
    set_uploaded_on: { type: DateTimeResolver },
    evs: {
      name: "EVs",
      type: evType,
    },
    ivs: {
      name: "IVs",
      type: ivType,
    },
    moves: {
      name: "Moves",
      type: new GraphQLList(GraphQLString),
    },
  }),
});

const setsType = new GraphQLObjectType({
  name: "Sets",
  fields: () => ({
    sets: { type: new GraphQLList(setType) },
    next_cursor: { type: GraphQLInt },
  }),
});

const pkmnType = new GraphQLObjectType({
  name: "Pokemon",
  fields: () => ({
    species: { type: GraphQLString },
    sets: {
      //name: 'Sets', // needs name bc it is a composition of another type!!!
      type: new GraphQLList(setType), // apparently, I can't use [type]-notation since [] is for expressions.
    },
  }),
});

const { importSet, toID } = require("./utils/ps-utils");
const ApiError = require("./error/ApiError");
const apiErrorHandler = require("./error/api-error-handler");

// Construct a schema, using GraphQL schema language
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      sets: {
        type: setsType,
        args: {
          species: {
            type: new GraphQLList(GraphQLString),
            defaultValue: [],
          },
          author: { type: GraphQLString, defaultValue: "" },
          speed: { type: GraphQLInt, defaultValue: 0 },
          date: {
            type: GraphQLString,
            defaultValue: "",
          },
          cursor: { type: GraphQLInt },
          limit: { type: GraphQLInt },
        },
        resolve: async (_, { species, author, speed, date, cursor, limit }) => {
          console.log("hi");
          let filters = 1;
          let args = [];
          let dbq =
            "SELECT set_id, name, author, species, nature, ability, item, moves, evs, ivs, description, set_uploaded_on FROM sets ";
          if (author !== "") {
            dbq += `WHERE author = $${filters} `;
            filters++;
            args.push(author);
          }
          if (speed > 0) {
            dbq += `${filters > 1 ? "AND" : "WHERE"} speed >= $${filters} `;
            filters++;
            args.push(speed);
          }
          if (species.length !== 0) {
            dbq += `${
              filters > 1 ? "AND" : "WHERE"
            } species = ANY($${filters}) `;
            filters++;
            args.push(species.map((s) => toID(s)));
            console.log(species);
          }
          if (date !== "") {
            dbq += `${
              filters > 1 ? "AND" : "WHERE"
            } set_uploaded_on >= CAST($${filters} AS DATE) `;
            filters++;
            args.push(date);
          }
          if (cursor) {
            // not null and not 0
            dbq += `${filters > 1 ? "AND" : "WHERE"} set_id > $${filters} `;
            filters++;
            args.push(cursor);
          }

          // AT THE END
          if (limit) {
            // not null and not 0
            dbq += `LIMIT $${filters} `;
            filters++;
            args.push(limit);
          }

          dbq += ";";
          let sets = [];
          try {
            console.log(dbq);
            sets = (await pool.query(dbq, args)).rows;
          } catch (error) {
            console.error(error);
            throw ApiError.badRequest(
              "Filter values are invalid, please fix the filters"
            );
          }
          const sliced = sets;
          return {
            sets: sliced,
            next_cursor:
              sliced.length === limit ? sliced[limit - 1].set_id : null,
          };
        },
      },
    }),
  }),
});

var app = express();

app.use(
  cors({
    origin: client_url,
    credentials: true,
  })
);

app.use(express.json());

function authenticateToken(req, res, next) {
  // Bearer TOKEN
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) next(ApiError.unauthorized("Client is not authenticated!")); // client is not authenticated at all

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err)
      next(ApiError.forbidden("Client authentication details are incorrect!")); // token has incorrect payload
    console.log(err);
    req.user = payload;
    next();
  });
}

function calculateSpeedStat(species, level, nature, evSpe, ivSpe) {
  let natureModifier = 1;
  if (natures[nature].plus === "spe") natureModifier = 1.1;
  if (natures[nature].minus === "spe") natureModifier = 0.9;
  const speedStat = Math.floor(
    (Math.floor(
      ((2.0 * pokedex[species].baseStats.spe +
        ivSpe +
        Math.floor(evSpe / 4.0)) *
        level) /
        100.0
    ) +
      5) *
      natureModifier
  );
  return speedStat;
}

app.post("/set", authenticateToken, async (req, res, next) => {
  try {
    const set = importSet(req.body.set)[0];
    const name = req.body.name;
    const desc = req.body.desc;

    if (!name) return next(ApiError.badRequest("Please name your set"));
    if (!desc || desc.length < 15)
      return next(ApiError.badRequest("Please describe your set a little"));
    if (!set) return next(ApiError.badRequest("Please provide a set"));
    if (!(set.species && set.level && set.nature && set.ability))
      return next(ApiError.badRequest("Set import is malformed"));

    const author = jwt.verify(
      req.headers["authorization"].split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET
    ).name;

    const speedStat = calculateSpeedStat(
      toID(set.species),
      set.level,
      toID(set.nature),
      set.evs?.spe ? set.evs?.spe : 0,
      set.ivs?.spe ? set.ivs?.spe : 31
    );

    const dbq = `INSERT INTO sets(name, author, species, nature, ability, item, moves, evs, ivs, level, speed, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
    const results = await pool.query(dbq, [
      name,
      author,
      toID(set.species),
      set.nature,
      set.ability,
      set.item,
      set.moves,
      set.evs,
      set.ivs,
      set.level,
      speedStat,
      desc,
    ]);
    res.sendStatus(200);
  } catch (error) {
    return next(ApiError.badRequest("Set import is malformed"));
  }
});

app.delete("/set", authenticateToken, async (req, res, next) => {
  try {
    const set_ids = req.body.set_ids;

    if (!set_ids || !set_ids.length)
      return next(ApiError.badRequest("Please choose which set IDs to delete"));

    const author = jwt.verify(
      req.headers["authorization"].split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET
    ).name;

    const dbq_sel = `SELECT author FROM sets WHERE set_id = ANY($1);`;
    const results_sel = await pool.query(dbq_sel, [set_ids]);

    for (const row of results_sel.rows) {
      if (author !== row.author)
        return next(ApiError.forbidden("This set does not belong to you!"));
    }

    const dbq_del = `DELETE FROM sets WHERE set_id = ANY($1);`;
    const results_del = await pool.query(dbq_del, [set_ids]);
    res.sendStatus(200);
  } catch (error) {
    return next(ApiError.badRequest("Error during database access"));
  }
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    /* there is also a 'context' parameter here that is 
  'request' by default, and stores middleware context from 
   previous middleware on this request such as db access, 
   authorization etc. This arg is available in all resolvers 
   as a param and is how you could access the db. */
  })
);

app.use(apiErrorHandler);
// https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log(
//     `Running a GraphQL API server at http://localhost:${PORT}/graphql`
//   );
// });
app.listen(PORT, () => {
  console.log(`server is running, taking requests from ${client_url}!`);
});
