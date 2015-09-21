var path = require('path');
var express = require('express');
var compass = require('node-compass');

var app = express();


var dir = {
	client: path.join(__dirname, "client"),
	clientApp: path.join(__dirname, "client/js/app"),
	clientAppTemplates: path.join(__dirname, "client/js/app/templates"),
	clientImages: path.join(__dirname, "client/images"),
	clientJson: path.join(__dirname, "client/json"),
	clientMp3: path.join(__dirname, "client/mp3"),
	clientDojoSource : path.join(__dirname, "client/js/dojo-release-1.10.4-src")
}; 




app.use('/client', express.static(dir.client));
app.use('/app', express.static(dir.clientApp));
app.use('/appTemplates', express.static(dir.clientAppTemplates));
app.use('/dojo-src', express.static(dir.clientDojoSource));
app.use('/images', express.static(dir.clientImages));
app.use('/mp3', express.static(dir.clientMp3));
app.use('/json', express.static(dir.clientJson));
app.get('/', function(req, res){
  res.sendFile("index.html", {root: dir.client});  
});

app.use(compass({
	project:  dir.client,
	sass: 'scss',
	css: 'css'
}));

app.listen(3000, function () {
	console.log("running on http://127.0.0.1:3000/");
});