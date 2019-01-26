/* eslint-disable */
const express = require('express');
const PORT = process.env.PORT || 5000
var app = express();


express()
.use('/',express.static('build/public'))
.listen(PORT, () => console.log(`Listening on ${ PORT }`));
