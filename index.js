var express = require('express');
var app = express();

app.post('/rsvp', function(req, res) {
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
