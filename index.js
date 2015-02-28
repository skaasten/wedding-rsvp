var updateSpreadsheet = function(rsvpInfo) {
    var Spreadsheet = require('edit-google-spreadsheet');
    Spreadsheet.load({
        debug: true,
        spreadsheetId: '1xu3nFDvPpGAWfr6_K2saTOFse0ttAUcnVXBBsc1ao0I',
        worksheetId: 'od6',

        oauth : {
            email: process.env.GOOGLE_EMAIL,
            key: process.env.GOOGLE_KEY
        }

    }, function sheetReady(err, spreadsheet) {
        if (err) {
            throw err;
        }

        spreadsheet.receive(function(err, rows, info) {
            if (err) {
            throw new Error("");
                err;
            }
            var entry = {};
            entry[info.lastRow + 1] = { 1: rsvpInfo };
            spreadsheet.add(entry);
            spreadsheet.send(function(err) {
                if(err) throw err;
            });
        });
    });
};

var express = require('express');
var app = express();

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var options = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    debug: true,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};
console.log(options);
var transporter = nodemailer.createTransport(smtpTransport(options));
var sendMail = function(info) {
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: "New Wedding RSVP", // Subject line
        text: info
    }, function(error, response){
        if(error){
            console.log(error);
        } else{
            console.log("Message sent: " + response);
        }
    });
};

app.post('/rsvp', function(req, res) {
    sendMail(req.body);
    res.send('ok');
});

app.get('/ping', function(req, res) {
  res.send('pong');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
