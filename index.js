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

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

var logMessage = function() {
    if (process.env.NODE_ENV == 'production') {
        return;
    }
    console.log.apply(this, arguments);
};

logMessage(options);
var transporter = nodemailer.createTransport(smtpTransport(options));
var sendMail = function(info) {
    var text = JSON.stringify(info, null, 2);
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: "New Wedding RSVP", // Subject line
        text: text
    }, function(error, response){
        if(error){
            logMessage(error);
        } else{
            logMessage("Message sent: " + text);
        }
    });
};

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.post('/rsvp/rsvp', jsonParser, function(req, res) {
    rsvp = {
        name: req.body.name,
        meal_choice: req.body.meal_choice,
        guest: req.body.guest,
        guest_meal: req.body.guest_meal,
        email: req.body.email,
        can_attend: req.body.can_attend == 'true'
    };
    logMessage(connection);
    connection.query('INSERT INTO rsvps SET ?', rsvp, function(err, result){
        if (result) {
            logMessage('Inserted rsvp into database:', err, result);
            res.send('ok');
        } else {
            logMessage('Error inserting into database' + err);
            res.status(500).send('error');
        }
    });
    sendMail(req.body);

});

app.get('/rsvp/ping', function(req, res) {
  res.send('pong');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  logMessage('Example app listening at http://%s:%s', host, port);
  connection.connect(function(err) {
  if (err) {
    logMessage('error connecting: ' + err.stack);
    return;
  }
  logMessage('connected as id ' + connection.threadId);
});
});
