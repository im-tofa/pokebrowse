/* 
    toID, importSet (aka importTeam) and parseExportedTeamLine are taken from   
    the PokémonShowdown client repository, with slight modifications:
    https://github.com/smogon/pokemon-showdown-client/blob/b2ec75af6fac552a33e76c999f4c7bd4b7e20dea/src/panel-teamdropdown.tsx

*/
function toID(text) {
	if (text?.id) {
		text = text.id;
	} else if (text?.userid) {
		text = text.userid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function importSet(buffer) {
    const lines = buffer.split("\n");

    const sets = [];
    let curSet = null;

    while (lines.length && !lines[0]) lines.shift();
    while (lines.length && !lines[lines.length - 1]) lines.pop();
    for (let line of lines) {
        line = line.trim();
        if (!curSet) {
            curSet = {
                name: '', species: '', gender: '',
                level: 100,
                moves: [],
            };
            sets.push(curSet);
            parseExportedTeamLine(line, true, curSet);
        } else {
            parseExportedTeamLine(line, false, curSet);
        }
    }
    return sets;
}

function parseExportedTeamLine(line, isFirstLine, set) {
    if (isFirstLine) {
        let item;
        [line, item] = line.split(' @ ');
        if (item) {
            set.item = item;
            if (toID(set.item) === 'noitem') set.item = '';
        }
        if (line.endsWith(' (M)')) {
            set.gender = 'M';
            line = line.slice(0, -4);
        }
        if (line.endsWith(' (F)')) {
            set.gender = 'F';
            line = line.slice(0, -4);
        }
        let parenIndex = line.lastIndexOf(' (');
        if (line.charAt(line.length - 1) === ')' && parenIndex !== -1) {
            set.species = line.slice(parenIndex + 2, -1);
            set.name = line.slice(0, parenIndex);
        } else {
            set.species = line
            set.name = '';
        }
    } else if (line.startsWith('Trait: ')) {
        line = line.slice(7);
        set.ability = line;
    } else if (line.startsWith('Ability: ')) {
        line = line.slice(9);
        set.ability = line;
    } else if (line === 'Shiny: Yes') {
        set.shiny = true;
    } else if (line.startsWith('Level: ')) {
        line = line.slice(7);
        set.level = +line;
    } else if (line.startsWith('Happiness: ')) {
        line = line.slice(11);
        set.happiness = +line;
    } else if (line.startsWith('Pokeball: ')) {
        line = line.slice(10);
        set.pokeball = line;
    } else if (line.startsWith('Hidden Power: ')) {
        line = line.slice(14);
        set.hpType = line;
    } else if (line === 'Gigantamax: Yes') {
        set.gigantamax = true;
    } else if (line.startsWith('EVs: ')) {
        line = line.slice(5);
        let evLines = line.split('/');
        set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
        for (let evLine of evLines) {
            evLine = evLine.trim();
            let spaceIndex = evLine.indexOf(' ');
            if (spaceIndex === -1) continue;
            let statid = toID(evLine.slice(spaceIndex + 1));
            if (!statid) continue;
            let statval = parseInt(evLine.slice(0, spaceIndex), 10);
            set.evs[statid] = statval;
        }
    } else if (line.startsWith('IVs: ')) {
        line = line.slice(5);
        let ivLines = line.split(' / ');
        set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
        for (let ivLine of ivLines) {
            ivLine = ivLine.trim();
            let spaceIndex = ivLine.indexOf(' ');
            if (spaceIndex === -1) continue;
            let statid = toID(ivLine.slice(spaceIndex + 1));
            if (!statid) continue;
            let statval = parseInt(ivLine.slice(0, spaceIndex), 10);
            if (isNaN(statval)) statval = 31;
            set.ivs[statid] = statval;
        }
    } else if (line.match(/^[A-Za-z]+ (N|n)ature/)) {
        let natureIndex = line.indexOf(' Nature');
        if (natureIndex === -1) natureIndex = line.indexOf(' nature');
        if (natureIndex === -1) return;
        line = line.substr(0, natureIndex);
        if (line !== 'undefined') set.nature = line;
    } else if (line.charAt(0) === '-' || line.charAt(0) === '~') {
        line = line.slice(line.charAt(1) === ' ' ? 2 : 1);
        if (line.startsWith('Hidden Power [')) {
            const hpType = line.slice(14, -1);
            line = 'Hidden Power ' + hpType;
            if (!set.ivs && Dex.types.isName(hpType)) {
                set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
                const hpIVs = Dex.types.get(hpType).HPivs || {};
                for (let stat in hpIVs) {
                    set.ivs[stat] = hpIVs[stat];
                }
            }
        }
        if (line === 'Frustration' && set.happiness === undefined) {
            set.happiness = 0;
        }
        set.moves.push(line);
    }
}

const evConvert = {
    "hp": "HP",
    "atk": "Atk",
    "def": "Def",
    "spa": "SpA",
    "spd": "SpD",
    "spe": "Spe",
};

function exportSet(set) {
    let text = '';

    // core
    if (set.name && set.name !== set.species) {
        text += `${set.name} (${set.species})`;
    } else {
        text += `${set.species}`;
    }
    if (set.gender === 'M') text += ` (M)`;
    if (set.gender === 'F') text += ` (F)`;
    if (set.item) {
        text += ` @ ${set.item}`;
    }
    text += `  \n`;
    if (set.ability) {
        text += `Ability: ${set.ability}  \n`;
    }
    if (set.moves) {
        for (let move of set.moves) {
            if (move.substr(0, 13) === 'Hidden Power ') {
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
        for (const stat of Object.keys(set.evs)) {
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
        for (const stat of Object.keys(set.ivs)) {
            if (set.ivs[stat] === undefined || isNaN(set.ivs[stat]) || set.ivs[stat] === 31) continue;
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
    if (typeof set.happiness === 'number' && set.happiness !== 255 && !isNaN(set.happiness)) {
        text += `Happiness: ${set.happiness}  \n`;
    }
    if (set.gigantamax) {
        text += `Gigantamax: Yes  \n`;
    }

    text += `\n`;
    return text;
}

exports.toID = toID;
exports.importSet = importSet;
exports.exportSet = exportSet;