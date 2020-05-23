# mkdata

** Generate synthetic datasets for testing **

### Install
- `npm i mkdata -S` or
- `npm i mkdata -g` or
- `npx mkdata ...`

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
const [X, y] = make.friedman1({ nSamples: 1000 })
```

### Datasets
- Friedman 1
- Friedman 2
- Friedman 3
- Hastie
- Moons
- Peak
- Ringnorm
- Spirals
