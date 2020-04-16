import { randomMinMax } from "./utils";
// eslint-disable-next-line
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
    // eslint-disable-next-line
  const spellChecker = new natural.Spellcheck([w]);
  let ww = randomizeWord(w);
    while (spellChecker.getCorrections(ww, 1)[0] !== w || ww === w) {
      console.log(ww)
    ww = randomizeWord(w);
  }
  return ww;
}
export { createDistractorOrtho };
