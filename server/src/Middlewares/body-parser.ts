var bodyparser = require('body-parser')

export const BodyParser =  [
    bodyparser.json(),
    bodyparser.urlencoded({ extended: true })
]