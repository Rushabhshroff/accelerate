const express = require('express');
const path = require('path')
const app = express()
app.use(express.static(path.resolve('./build')))
let server = app.listen(7000, () => {
    console.log("Server Running")
})