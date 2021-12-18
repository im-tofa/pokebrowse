
console.log("hello 2 typescript!");

let names = ["a", "b", "c"];

names = names.map(function(value) {
    return value.toUpperCase();
});

function endofstatement(token: number | "\n" | ";") {
    return token === "\n" || token === ";";
}

const array = ["a", "b", "c"];
 
array.push(...array, ...array);

console.log(array);

function repeatstring(input: string, times: number): string {
    let repeated = "";
    while(times > 0) {
        repeated += input;
        times--;
    }
    return repeated;
}

console.log(repeatstring("lol", 3));

type Vec = {
    x: number,
    y: number
};

function subtract(p: Vec) {
    p.x = p.x - 1;
    p.y = p.y - 1;
}

const point: Vec = {x: 1, y: 2} as const;
subtract(point);

console.log(point);