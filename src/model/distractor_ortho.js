import { randomMinMax } from "./utils";
import natural from "natural";

function randomizeWord(w) {
  const goodIndex = randomMinMax(0, w.length);
  w = w.split("");
  const tmp = w[goodIndex];
  w[goodIndex] = w[goodIndex + 1];
  w[goodIndex + 1] = tmp;
  return w.join("");
}

function createDistractorOrtho(w) {
  const spellChecker = new natural.Spellcheck([w]);
  let ww = randomizeWord(w);
  while (spellChecker.getCorrections(ww, 1)[0] !== w || ww === w) {
    ww = randomizeWord(w);
  }
  return ww;
}

function isSimilarWord(s, w) {
  const spellChecker = new natural.Spellcheck([s]);
  return spellChecker.getCorrections(w, 1)[0] === s;
}
export { createDistractorOrtho, isSimilarWord };
