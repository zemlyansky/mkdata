# Generate synthetic datasets for machine learning

### Open-source data generator working in terminal and as a JavaScript module

Using synthetic datasets is the easiest and the most robust way to test machine learning models and statistical methods. Instead of relying on real-world data with not fully known dependencies between variables, artificial data has clear rules under the hood. Another benefit is there's almost no size limit. We can generate as many observations as we need for our purposes. 

With `mkdata`, you can generate new data based on nine well-known problems (e.g. Friedman datasets). You can use it as a JavaScript module producing 2D arrays ready for model training. Or create CSV files calling `mkdata` as a CLI app without writing code at all.

### Install mkdata
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

### Synthetic datasets
- Friedman 1 (`y = 10 * sin(Pi * x1 * x2) + 20 * (x3 - 0.5) ** 2 + 10 * x4 + 5 * x5 + e`)
- Friedman 2 (`y = sqrt(x1 ** 2 + (x2 * x3 - 1 / (x2 * x4)) ** 2) + e`)
- Friedman 3 (`y = atan(x2 * x3 - 1 / (x2 * x4) / x1) + e`)
- Hastie (binary classification problem used in [Hastie et al 2009](https://web.stanford.edu/~hastie/Papers/ESLII.pdf))
- Moons (two interleaving half circles)
- Peak (peak benchmark problem)
- Ringnorm (from [Breiman 1996](http://docs.salford-systems.com/BIAS_VARIANCE_ARCING.pdf))
- Spirals (two entangled spirals)
- Swissroll (from S. Marsland 2009)

### Web demo
Generate same synthetic datasets without installing `mkdata` here: [https://statsim.com/gen/](https://statsim.com/gen/) (CSV format)
