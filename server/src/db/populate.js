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
  path: path.join(__dirname, "..", "..", "configs", ".env"),
});

/* DATABASE SETUP */
const { Pool, Client } = require("pg");
const pool = process.env.DATABASE_URL
  ? new Pool({
      ssl: { ca: process.env.CA_CERT },
    })
  : new Pool();

const pokedex = require(path.join(__dirname, "..", "pkmnstats"));

const PORT = process.env.PORT || 3000;

const { importSet, toID, natures } = require("../utils/ps-utils");

function calculateSpeedStat(species, level, nature, evSpe, ivSpe) {
  console.log(nature);
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

const addSet = async (name, setImport) => {
  try {
    const set = importSet(setImport)[0];
    const desc = "Sample description; see actual description using link.";

    const author = "smogon"; // TODO: Fix

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
  } catch (error) {
    console.error(error);
  }
};

const sets = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "..", "..", "scraper", "sets.json")
  )
);

for (const species in sets) {
  for (const set in sets[species]) {
    addSet(set, sets[species][set]);
  }
}
// console.log(sets);
