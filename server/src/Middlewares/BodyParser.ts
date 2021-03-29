var bodyparser = require('body-parser')

export default [
    bodyparser.json(),
    bodyparser.urlencoded({ extended: true })
]