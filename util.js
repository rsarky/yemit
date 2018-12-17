const fs = require('fs')
const utils = require('utils')
const casper = require('casper').create({
    verbose: true
});
if(casper.cli.has('username') && casper.cli.has('password')) {
    const username = casper.cli.get('username')
    const password = casper.cli.get('password')
} else {
    casper.log('Usage casperjs index.js --username=<username> --password=<password>', 'error')
    casper.exit(1)
}
const loginUrl = 'https://slcm.manipal.edu/loginForm.aspx'
const acadUrl  = 'https://slcm.manipal.edu/Academics.aspx'

casper.start(loginUrl, function () {
    this.waitForSelector('div.login_form',
    function() {
        this.echo('Login Page opened successfully.', 'INFO')
    },
    function() {
        casper.log('Some error occurred. Check your internet connection', 'error')
        casper.exit()
    },
    5000)
})

casper.then(function() {
    this.fillSelectors('div.form-group.mt-35.mb-20', {
        'input[name="txtUserid"]': username
    }, false)
    this.fillSelectors('div.form-group.mt-35.mb-20 + div.form-group', {
        'input[name="txtpassword"]': password
    }, false)
    this.click('input[value="Sign in"]')
})

casper.then(function() {
    this.waitForSelector('a[href="Academics.aspx"]',
    function () {
        this.echo("Signed in", 'INFO')
    },
    function () {
        casper.log('Sign In Failed', 'error')
        this.exit()
    },
    5000)
})

casper.thenOpen(acadUrl, function () {
    if(this.getCurrentUrl() === acadUrl) {
        this.echo("Academics page opened successfully.", 'INFO')
    } else {
        casper.log("Some Error occurred.", 'error')
    }
})

function getData() {
    var a = []
    var data = document.querySelectorAll('#tblAttendancePercentage tbody tr')
    Array.prototype.forEach.call(data, function(tr) {
        var obj = {}
        obj['Subject'] = tr.cells[1].innerHTML
        obj['Total'] = tr.cells[4].innerHTML
        obj['Attended'] = tr.cells[5].innerHTML
        obj['Bunks'] = tr.cells[6].innerHTML
        obj['Percent'] = tr.cells[7].innerHTML
        a.push(obj)
    })
    return a;
}
casper.then(function() {
    this.waitForSelector('#tblAttendancePercentage tbody tr', function() {
        this.echo("Attendance found", 'INFO')
        var attendance = []
        attendance = this.evaluate(getData)
        var stringData = JSON.stringify(attendance)
        var currentFile = require('system').args[3]
        var curFilePath = fs.absolute(currentFile).split('/')
        curFilePath.pop();
        fs.changeWorkingDirectory(curFilePath.join('/'))
        if(!fs.exists(fs.workingDirectory + '/attendance.json')) {
            fs.touch(fs.workingDirectory + '/attendance.json')
        }
        fs.write(fs.workingDirectory + '/attendance.json', stringData, 'w')
    },
    function() {
        this.echo("Attendance not found")
    },
    5000)
})

casper.run();
