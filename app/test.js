const fs = require('fs')
const data = require('./src/database/dataset-new.json')

let equipments = ['barbell','dumbbell','machine','kettlebell','band','cable','plate']
let d = data.map((s) => {
    if(s.category == 'duration-time'){
        s.category = 'duration-reps'
    }
    return s
})


fs.writeFileSync('./src/database/dataset-new.json', JSON.stringify(d,undefined,2))
