const express = require('express')
const main = express.Router()

main.use('/', (res, req) => {console.log("ok")});


module.exports = main