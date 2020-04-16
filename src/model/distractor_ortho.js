let natural = require("natural");
let w = "garçon";
let spellChecker = natural.SpellCheck(w)

function randomMinMax(min = 0, max = 1) {
    return (Math.random() * max) - min
}

function randomizeWord(w) {

}

function createDistractorOrtho(w) {
    let ww = randomizeWord(w)
    while (spellChecker.getCorrections(ww, 1) !== w) {
        ww = randomizeWord(w)
    }
    return ww
}

console.log(createDistractorOrtho(w))
