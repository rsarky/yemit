#! /usr/bin/env node
const shell = require('shelljs')
const path = require('path')
const meow = require('meow')

const cli = meow(`
    Usage
        $ yemit <username> <password>
`)

if (cli.input.length !== 2) {
    cli.showHelp([code=1])
}

let util = path.join(__dirname, 'util.js')
let index = path.join(__dirname, 'index.js')
shell.exec('casperjs ' + util + ` --username=${cli.input[0]} --password=${cli.input[1]}`)
shell.exec('node ' + index)
