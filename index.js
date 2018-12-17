const casper = require('casper').create();
if(casper.cli.has('username') && casper.cli.has('password')) {
    const username = casper.cli.get('username')
    const password = casper.cli.get('password')
} else {
    casper.exit()
}
const loginUrl = 'https://slcm.manipal.edu/loginForm.aspx'
const acadUrl  = 'https://slcm.manipal.edu/Academics.aspx'
casper.start(loginUrl, function () {
    this.waitForSelector('div.login_form')
})

casper.then(function() {
    this.fillSelectors('div.form-group.mt-35.mb-20', {
        'input[name="txtUserid"]': username
    }, false)
    this.fillSelectors('div.form-group.mt-35.mb-20 + div.form-group', {
        'input[name="txtpassword"]': password
    }, false)
})

casper.then(function() {
    this.click('input[value="Sign in"]')
})

casper.then(function() {
    this.waitForSelector('a[href="Academics.aspx"]',
    function () {
        this.echo("Signed in")
        this.echo(this.getCurrentUrl())
    },
    function () {
        this.echo("Did not load")
    },
    5000)
})

casper.thenOpen(acadUrl, function () {
    if(this.getCurrentUrl() === acadUrl) {
        this.echo("Academics page opened successfully.")
    } else {
        this.echo("Error occurred.")
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
        this.echo("Attendance found")
        var attendance = []
        attendance = this.evaluate(getData)
        this.echo(JSON.stringify(attendance))
    },
    function() {
        this.echo("Attendance not found")
    },
    5000)
})

casper.run();
