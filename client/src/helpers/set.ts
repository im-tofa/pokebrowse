import { Set } from "./types";

const evConvert = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
};

export function evToString(set: Set, isEv: boolean = true): string {
  let evs = "";
  const key = isEv ? "evs" : "ivs";
  for (const ev in set[key]) {
    // to skip __typename, since it is iterable for some reason...
    if (ev in evConvert) {
      evs +=
        set[key]?.hasOwnProperty(ev) && set[key][ev] !== (isEv ? 0 : 31)
          ? `${set[key][ev]} ${evConvert[ev]} / `
          : "";
    }
  }
  evs = evs.trim();
  evs = evs.endsWith("/") ? evs.slice(0, -1) : evs;
  return evs;
}

export function exportSet(set: any) {
  let text = "";

  // core
  if (set.name && set.name !== set.species) {
    text += `${set.name} (${set.species})`;
  } else {
    text += `${set.species}`;
  }
  if (set.gender === "M") text += ` (M)`;
  if (set.gender === "F") text += ` (F)`;
  if (set.item) {
    text += ` @ ${set.item}`;
  }
  text += `  \n`;
  if (set.ability) {
    text += `Ability: ${set.ability}  \n`;
  }
  if (set.moves) {
    for (let move of set.moves) {
      if (move.substr(0, 13) === "Hidden Power ") {
        const hpType = move.slice(13);
        move = move.slice(0, 13);
        move = `${move}[${hpType}]`;
      }
      if (move) {
        text += `- ${move}  \n`;
      }
    }
  }

  // stats
  let first = true;
  if (set.evs) {
    for (const stat in evConvert) {
      if (!set.evs[stat]) continue;
      if (first) {
        text += `EVs: `;
        first = false;
      } else {
        text += ` / `;
      }
      text += `${set.evs[stat]} ${evConvert[stat]}`;
    }
  }
  if (!first) {
    text += `  \n`;
  }
  if (set.nature) {
    text += `${set.nature} Nature  \n`;
  }
  first = true;
  if (set.ivs) {
    for (const stat in evConvert) {
      if (
        set.ivs[stat] === undefined ||
        isNaN(set.ivs[stat]) ||
        set.ivs[stat] === 31
      )
        continue;
      if (first) {
        text += `IVs: `;
        first = false;
      } else {
        text += ` / `;
      }
      text += `${set.ivs[stat]} ${evConvert[stat]}`;
    }
  }
  if (!first) {
    text += `  \n`;
  }

  // details
  if (set.level && set.level !== 100) {
    text += `Level: ${set.level}  \n`;
  }
  if (set.shiny) {
    text += `Shiny: Yes  \n`;
  }
  if (
    typeof set.happiness === "number" &&
    set.happiness !== 255 &&
    !isNaN(set.happiness)
  ) {
    text += `Happiness: ${set.happiness}  \n`;
  }
  if (set.gigantamax) {
    text += `Gigantamax: Yes  \n`;
  }

  text += `\n`;
  return text;
}
