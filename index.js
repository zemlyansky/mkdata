const Random = require('seedrandom')

const defaults = {
  nSamples: 100,
  noise: 0,
  seed: null,
  X: null // Passing X will generate only a target variable
}

function shuffle (X, y) {
  const n = X.length
  for (let ri = n - 1; ri > 0; ri--) {
    const i = Math.floor(Math.random() * (ri + 1))
    if (X) [X[ri], X[i]] = [X[i], X[ri]]
    if (y) [y[ri], y[i]] = [y[i], y[ri]]
  }
}

function initRandom (seed) {
  return seed ? new Random(seed) : Math.random
}

// Based on https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function normal (random) {
  let u = 0
  let v = 0
  while (u === 0) u = random()
  while (v === 0) v = random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

function neg (X) {
  return X.map(row => row.map(v => - v))
}

function friedman1 (opts) {
  const datasetDefaults = {
    nFeatures: 10
  }

  const options = Object.assign({}, defaults, datasetDefaults, opts)
  const random = initRandom(options.seed)

  if (options.nFeatures < 5) throw new Error('nFeatures must be at least five')

  const X = []
  const y = []
  const f = (x) => 10 * Math.sin(Math.PI * x[0] * x[1]) + 20 * Math.pow((x[2] - 0.5), 2) + 10 * x[3] + 5 * x[4] + options.noise * random()

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = []
    for (let ci = 0; ci < options.nFeatures; ci++) {
      x.push(random())
    }
    X.push(x)
    y.push(f(x))
  }

  return [X, y, f]
}

function friedman2 (opts) {
  const options = Object.assign({}, defaults, opts)
  const random = initRandom(options.seed)

  const X = []
  const y = []
  const f = (x) => Math.sqrt(Math.pow(x[0], 2) + Math.pow(x[1] * x[2] - 1 / (x[1] * x[3]), 2)) + options.noise * random()

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = [
      random() * 100,
      random() * 520 * Math.PI + 40 * Math.PI,
      random(),
      random() * 10 + 1
    ]
    X.push(x)
    y.push(f(x))
  }

  return [X, y, f]
}

function friedman3 (opts) {
  const options = Object.assign({}, defaults, opts)
  const random = initRandom(options.seed)

  const X = []
  const y = []
  const f = (x) => Math.atan(x[1] * x[2] - 1 / (x[1] * x[3]) / x[0]) + options.noise * random()

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = [
      random() * 100,
      random() * 520 * Math.PI + 40 * Math.PI,
      random(),
      random() * 10 + 1
    ]
    X.push(x)
    y.push(f(x))
  }

  return [X, y, f]
}

function hastie (opts) {
  const options = Object.assign({}, defaults, opts)
  const random = initRandom(options.seed)

  const X = []
  const y = []
  const f = (x) => +(x.reduce((a, v) => a + v * v, 0) > 9.34)

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = []
    for (let ci = 0; ci < 10; ci++) {
      const n = normal(random)
      x.push(n)
    }
    X.push(x)
    y.push(f(x))
  }
  return [X, y]
}

function moons (opts) {
  const datasetDefaults = {
    shuffle: true
  }

  const options = Object.assign({}, defaults, datasetDefaults, opts)

  let nSamplesIn
  let nSamplesOut

  if (Array.isArray(options.nSamples)) {
    nSamplesOut = options.nSamples[0]
    nSamplesIn = options.nSamples[1]
  } else {
    nSamplesOut = Math.floor(options.nSamples / 2)
    nSamplesIn = options.nSamples - nSamplesOut
  }

  const X = []
  const y = []

  const stepOut = Math.PI / nSamplesOut
  for (let s = 0; s < Math.PI; s += stepOut) {
    X.push([Math.cos(s), Math.sin(s)])
    y.push(0)
  }

  const stepIn = Math.PI / nSamplesIn
  for (let s = 0; s < Math.PI; s += stepIn) {
    X.push([0.5 - Math.cos(s), 1 - Math.sin(s)])
    y.push(1)
  }

  if (options.shuffle) {
    shuffle(X, y)
  }

  return [X, y]
}

// Peak Benchmark Problem (Regression)
// Based on mlbench: https://cran.r-project.org/web/packages/mlbench/
function peak (opts) {
  const datasetDefaults = {
    nFeatures: 10
  }
  const options = Object.assign({}, defaults, datasetDefaults, opts)
  const random = initRandom(options.seed)

  const X = []
  const y = []
  const f = (radius) => 25 * Math.exp(-0.5 * radius * radius)

  for (let ri = 0; ri < options.nSamples; ri++) {
    let x = []
    for (let ci = 0; ci < options.nFeatures; ci++) {
      x.push(normal(random))
    }
    const radius = Math.random() * 3
    const metro = Math.sqrt(x.reduce((a, v) => a + v * v, 0))
    x = x.map(v => radius * (v / metro))
    X.push(x)
    y.push(f(radius))
  }

  return [X, y]
}

// Ringnorm Benchmark Problem (Classification)
// Based on mlbench: https://cran.r-project.org/web/packages/mlbench/
// Ref: Breiman, L. (1996).  Bias, variance, and arcing classifiers
function ringnorm (opts) {
  const datasetDefaults = {
    nFeatures: 10
  }

  const options = Object.assign({}, defaults, datasetDefaults, opts)
  const random = initRandom(options.seed)
  const split = options.nSamples / 2
  const y = Array(Math.floor(split)).fill(0).concat(Array(Math.ceil(split)).fill(1))
  const a = 1 / Math.sqrt(options.nFeatures)
  const X = y.map(v => {
    if (v) {
      return Array(options.nFeatures).fill(0).map(_ => normal(random) * 2)
    } else {
      return Array(options.nFeatures).fill(0).map(_ => normal(random) + a)
    }
  })

  return [X, y]
}

function oneSpiral (n, cycles=1, sd=0, seed) {
  // const w = Array(n).fill(0).map((_, i) => i * cycles / n)
  const random = initRandom(seed)
  const X = Array(n).fill(0).map((_, i) => {
    const w = i * cycles / n
    x1 = (2 * w + 1) * Math.cos(2 * Math.PI * w) / 3
    x2 = (2 * w + 1) * Math.sin(2 * Math.PI * w) / 3
    if (sd > 0) {
      const e = normal(random) * sd
      const xs = Math.cos(2 * Math.PI * w) - Math.PI * (2 * w + 1) * Math.sin(2 * Math.PI * w)
      const ys = Math.sin(2 * Math.PI * w) + Math.PI * (2 * w + 1) * Math.cos(2 * Math.PI * w)
      const nrm = Math.sqrt(xs * xs + ys * ys)
      x1 += e * ys / nrm
      x2 -= e * xs / nrm
    }
    return [x1, x2]
  })
  return X
}

function spirals (opts) {
  const datasetDefaults = {
    cycles: 1
  }

  const options = Object.assign({}, defaults, datasetDefaults, opts)
  const random = initRandom(options.seed)

  const split = options.nSamples / 2
  const y = Array(Math.floor(split)).fill(0).concat(Array(Math.ceil(split)).fill(1))
  const X = oneSpiral(Math.floor(split), options.cycles, options.noise, options.seed)
    .concat(neg(oneSpiral(Math.ceil(split), options.cycles, options.noise, options.seed)))

  if (options.shuffle) {
    shuffle(X, y)
  }

  return [X, y]
}


module.exports = {
  friedman1, friedman2, friedman3, hastie, moons, peak, ringnorm, spirals
}
