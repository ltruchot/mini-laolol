var path = require('path');
var express = require('express');
var compass = require('node-compass');

var app = express();


var dir = {
	client: path.join(__dirname, "client"),
	style: path.join(__dirname, "client", "css"),
	application: path.join(__dirname, "client", "views", "laolol", "laoletterchallenge"),
	public: path.join(__dirname, "public")	
}; 

app.use('/client', express.static(dir.client));
app.use('/style', express.static(dir.style));
app.use('/application', express.static(dir.application));
app.use('/public', express.static(dir.public));
app.get('/', function(req, res){
	res.sendFile("laoletterchallenge.html", {
		root: dir.application
	});  
});

app.use(compass({
	project:  path.join(__dirname, "client"),
	sass: 'views/laolol/laoletterchallenge',
	css: 'css'
}));

app.listen(3000, function () {
	console.log("running on http://127.0.0.1:3000/");
});