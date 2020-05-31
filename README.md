# mkdata

**Generate synthetic datasets**

### Install
- `npm i mkdata -S` or
- `npm i mkdata -g` or run using `npx` without installation
- `npx mkdata -d moons -s 1000 -o friedman1.csv`

### CLI
```
mkdata -d friedman1 -s 1000 -o friedman1.csv
```
or using `stdout`
```
mkdata -d friedman1 -s 1000 > friedman1.csv
```

Params:
- `-d`, `--dataset` - dataset name
- `-f`, `--nFeatures` - number of features
- `-s`, `--nSamples` - number of samples
- `-n`, `--noise` - noise size
- `-o`, `--output` - output file name
- `-r`, `--randomState` - seed

### API
```javascript
const make = require('mkdata')
const [X, y] = make.spirals({ nSamples: 1000 })
```

`friedman1`, `friedman2`, `friedman3` methods also return data generating functions:
```javascript
const [X, y, f] = make.friedman3({ nSamples: 1000 })
const yt = X.map(f)
```

### Datasets
- Friedman 1 (`y = 10 * sin(Pi * x1 * x2) + 20 * (x3 - 0.5) ** 2 + 10 * x4 + 5 * x5 + e`)
- Friedman 2 (`y = sqrt(x1 ** 2 + (x2 * x3 - 1 / (x2 * x4)) ** 2) + e`)
- Friedman 3 (`y = atan(x2 * x3 - 1 / (x2 * x4) / x1) + e`)
- Hastie (binary classification problem used in [Hastie et al 2009](https://web.stanford.edu/~hastie/Papers/ESLII.pdf))
- Moons (two interleaving half circles)
- Peak (peak benchmark problem)
- Ringnorm (from [Breiman 1996](http://docs.salford-systems.com/BIAS_VARIANCE_ARCING.pdf))
- Spirals (two entangled spirals)
