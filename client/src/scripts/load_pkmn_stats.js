import fetch from "node-fetch";
import fs from "fs";
fetch("https://play.pokemonshowdown.com/data/pokedex.json")
  .then((response) => response.json())
  .then((json) =>
    fs.writeFile("pkmnstats.json", JSON.stringify(json), "utf8", () =>
      console.log("finished!")
    )
  );
