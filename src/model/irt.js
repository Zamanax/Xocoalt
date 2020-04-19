function normal(mean, stdDev) {
  let distr = [];
  for (let i = -10; i <= 10; i += 0.2) {
    distr.push([i, y(i)]);
  }
  return distr;

  function y(x) {
    return (
      (1 / (Math.sqrt(2 * Math.PI) * stdDev)) *
      Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)))
    );
  }
}
/**
 * Calculates the probability that someone with a given ability level theta
 * will answer correctly an item. Uses the 3 parameters logistic model.
 */
function itemResponseFunction(zeta, theta) {
  return zeta.c + (1 - zeta.c) / (1 + Math.exp(-zeta.a * (theta - zeta.b)));
}
function IRT(delta, theta) {
  return itemResponseFunction({ a: 1.7, b: delta, c: 0 }, theta);
}

/**
 * Calculates how much information an item (or an array of items) contributes
 * for a given ability level theta.
 */
function information(zeta, theta) {
  let zetaArr = Array.isArray(zeta) ? zeta : [zeta];
  return zetaArr.reduce((acc, zeta) => {
    let { a, b, c } = zeta;
    let probHit = 1 / (1 + Math.exp(-a * (theta - b)));
    return (
      acc +
      ((Math.pow(a, 2) * (1 - c) * (1 - probHit)) / (c + (1 - c) * probHit)) *
        Math.pow(probHit, 2)
    );
  }, 0);
}

/**
 * Estimate ability using the EAP method.
 * Reference: "Marginal Maximum Likelihood estimation of item parameters: application of
 * an EM algorithm" Bock & Aitkin 1981 --- equation 14.
 */
function estimateAbilityEAP(answers, zeta) {
  const ABILITY_PRIOR = normal(0, 1);
  let num = 0;
  let nf = 0;
  for (let i = 0; i < ABILITY_PRIOR.length; i++) {
    let theta = ABILITY_PRIOR[i][0];
    let probability = ABILITY_PRIOR[i][1];
    let like = likelihood(theta);
    num += theta * like * probability;
    nf += like * probability;
  }
  return num / nf;

  function likelihood(theta) {
    return zeta.reduce((acc, zeta, i) => {
      let irf = itemResponseFunction(zeta, theta);
      return answers[i] === 1 ? acc * irf : acc * (1 - irf);
    }, 1);
  }
}

export { itemResponseFunction, IRT, information, estimateAbilityEAP };
