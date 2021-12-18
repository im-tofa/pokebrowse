const sets = require('./sets');

const res = {...Object.entries(sets).map(([key, val]) => {const res = {}; res[key.toLowerCase()] = val; return res;})};

let final = {};
for(r in res){
    final = {...final, ...res[r]};
}
// console.log(JSON.stringify(final));

const fs = require('fs');
fs.writeFileSync('fixed_sets.js', JSON.stringify(final));