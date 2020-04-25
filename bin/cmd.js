#!/usr/bin/env node
const make = require('../')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    dataset: 'd',
    header: 'h',
    nFeatures: 'f',
    nSamples: 's',
    noise: 'n',
    output: 'o',
    randomState: 'r'
  },
  default: {
    dataset: 'friedman1',
    nSamples: 100
  }
})

const dataset = argv._[0] || argv.dataset

if (Object.keys(make).includes(dataset)) {
  const [X, y] = make[dataset](argv)
  let res = X[0].map((_, i) => 'x' + (i + 1)).join(',')
  res += y ? ',y' : ''
  res += '\n'

  X.forEach((x, i) => {
    res += x.join(',')
    res += y ? ',' + y[i] : ''
    res += '\n'
  })

  if (argv.output && argv.output.length) {
    fs.writeFileSync(argv.output, res)
  } else {
    process.stdout.write(res)
  }
} else {
  throw new Error('No dataset with a name', dataset)
}
// Read
