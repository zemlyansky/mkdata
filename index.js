const Random = require('seedrandom')

const defaults = {
  nSamples: 100,
  noise: 0,
  randomState: null
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

function friedman1 (opts) {
  const datasetDefaults = {
    nFeatures: 10
  }

  const options = Object.assign({}, defaults, datasetDefaults, opts)
  const random = initRandom(options.seed)

  if (options.nFeatures < 5) throw new Error('nFeatures must be at least five')

  const X = []
  const y = []

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = []
    for (let ci = 0; ci < options.nFeatures; ci++) {
      x.push(random())
    }
    X.push(x)
    y.push(10 * Math.sin(Math.PI * x[0] * x[1]) + 20 * Math.pow((x[2] - 0.5), 2) + 10 * x[3] + 5 * x[4] + options.noise * random())
  }

  return [X, y]
}

function friedman2 (opts) {
  const options = Object.assign({}, defaults, opts)
  const random = initRandom(options.seed)

  const X = []
  const y = []

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = [
      random() * 100,
      random() * 520 * Math.PI + 40 * Math.PI,
      random(),
      random() * 10 + 1
    ]
    X.push(x)
    y.push(Math.sqrt(Math.pow(x[0], 2) + Math.pow(x[1] * x[2] - 1 / (x[1] * x[3]), 2)) + options.noise * random())
  }

  return [X, y]
}

function friedman3 (opts) {
  const options = Object.assign({}, defaults, opts)
  const random = initRandom(options.seed)

  const X = []
  const y = []

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = [
      random() * 100,
      random() * 520 * Math.PI + 40 * Math.PI,
      random(),
      random() * 10 + 1
    ]
    X.push(x)
    y.push(Math.atan(x[1] * x[2] - 1 / (x[1] * x[3]) / x[0]) + options.noise * random())
  }

  return [X, y]
}

function hastie (opts) {
  const options = Object.assign({}, defaults, opts)
  const random = initRandom(options.seed)

  const X = []
  const y = []

  for (let ri = 0; ri < options.nSamples; ri++) {
    const x = []
    let target = 0
    for (let ci = 0; ci < 10; ci++) {
      const n = normal(random)
      x.push(n)
      target += n * n
    }
    X.push(x)
    y.push(+(target > 9.34))
  }

  return [X, y]
}

function moons (opts) {
  const datasetDefaults = {
    shuffle: 10
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
    for (let ri = options.nSamples - 1; ri > 0; ri--) {
      const i = Math.floor(Math.random() * (ri + 1))
      ;[X[ri], X[i]] = [X[i], X[ri]]
      ;[y[ri], y[i]] = [y[i], y[ri]]
    }
  }

  return [X, y]
}

module.exports = {
  friedman1, friedman2, friedman3, hastie, moons
}
