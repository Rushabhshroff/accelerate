const fs = require('fs')
const data = require('./src/database/dataset.json')


let d = data.map((s) => {
    s['equipment'] = ""
    return s
})


fs.writeFileSync('./src/database/dataset.json', JSON.stringify(d))
