var path = require('path');
var express = require('express');
var compass = require('node-compass');

var app = express();


var dir = {
	client: path.join(__dirname, "/client"),
	clientApp: path.join(__dirname, "/client/js/app"),
	clientImages: path.join(__dirname, "/client/images"),
	clientDojoSource : path.join(__dirname, "/client/js/dojo-release-1.10.4-src")
}; 


app.use(compass({
	project:  dir.client + '/scss',
	css:  dir.client + '/css'
}));


app.use('/client', express.static(dir.client));
app.use('/app', express.static(dir.clientApp));
app.use('/dojo-src', express.static(dir.clientDojoSource));
app.use('/images', express.static(dir.clientImages));
app.get('/', function(req, res){
  res.sendFile("index.html", {root: dir.client});
});

app.listen(3000);