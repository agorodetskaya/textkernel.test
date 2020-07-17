# Textkernel SPA test task
This application shows real-time stocks price and chart for specific date range. You can select multiple stocks to compare their price.

## Requirments
- **Node**: > 12.x
- **npm**: > 6.x
- Basic knowledge about React, Redux and Material UI :)

Verify
```
node -v
npm -v
```


## Setup
Run
```bash
git clone https://github.com/agorodetskaya/textkernel.test.git
cd textkernel.test
npm install
```

## Configuration
By default, there is predefined Twelvedata API key, so you don't need an additional configuration. <br>
Default key is verified and has 12 req/s limit, it may be not enough for stable work of the application. You can generate your own API key (see: https://twelvedata.com/apikey). To use it - update value `API_KEY` in `./src/config.js` with new key.

## Dev server
Inside `textkernel.test` package run 
```bash
npm start
```

## Prodaction build
Inside `textkernel.test` package run 
```bash
npm build
```

Build files are generated in `./build` directory.

## Run tests
Inside `textkernel.test` package run 
```bash
npm test
```