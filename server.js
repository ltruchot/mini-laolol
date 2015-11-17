var path = require('path');
var express = require('express');
var compass = require('node-compass');
var favicon = require('serve-favicon');
var port = process.env.PORT || 8080;
var app = express();
var dir = {
    'client': path.join(__dirname, 'client'),
    'style': path.join(__dirname, 'client', 'css'),
    'application': path.join(__dirname, 'client', 'views', 'index'),
    'laololPublic': path.join(__dirname, 'public')
};

app.use(favicon(path.join(dir.laololPublic, 'images', 'favicon', 'favicon.ico')));
app.use('/client', express.static(dir.client));
app.use('/style', express.static(dir.style));
app.use('/application', express.static(dir.application));
app.use('/public', express.static(dir.laololPublic));
app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: dir.application
    });
});

app.use(compass({
    project: path.join(__dirname, 'client'),
    sass: 'views/index',
    css: 'css'
}));

app.listen(port, function() {
    console.log('LAOLOL server is running on http://localhost:8080/');
});
