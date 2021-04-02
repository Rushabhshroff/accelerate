const fs = require('fs')
const data = require('./src/database/dataset.json')


let d = data.map((s) => {
    s['other-bodyparts'] = []
    return s
})


fs.writeFileSync('./src/database/dataset-new.json', JSON.stringify(d))
