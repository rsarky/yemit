const data = require('./attendance.json')
const Table = require('cli-table')

const table = new Table({
    head: ['Subject', 'Total', 'Attended', 'Bunks', 'Percent'],
})

data.forEach((ele) => {
    table.push([ele.Subject, ele.Total, ele.Attended, ele.Bunks, ele.Percent])
})

console.log(table.toString())


