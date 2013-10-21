var http = require('http');
var send = require('send');
var archer = require('archer-lipsum');
var router = require('router');
var url = require('url');
var route = router();

function sendJSON(res, result) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({result: result}));
}

route.get('/api/{character}', function(req, res) {
  var character = req.params.character;
  sendJSON(res, archer(character));
});

route.get('/api/{character}/words/{wordCount}', function(req, res) {
  var character = req.params.character;
  var wordCount = parseInt(req.params.wordCount, 10) || 20;
  sendJSON(res, archer(character, wordCount));
});

route.get('/api/{character}/paragraphs/{paragraphCount}', function(req, res) {
  var character = req.params.character;
  var paragraphCount = parseInt(req.params.paragraphCount, 10) || 20;
  sendJSON(res, archer(character, 0, paragraphCount));
});

// catchall
route.get('*', function(req, res) {
  // your custom error-handling logic:
  function error(err) {
    res.statusCode = err.status || 500;
    res.end(err.message);
  }

  send(req, url.parse(req.url).pathname)
    .root('./public')
    .on('error', error)
    .pipe(res);
});


http.createServer(route).listen(process.env.PORT || 5000);