/*
* Title: server.js
* Abstract: Javascript file for serving MLU pdf files
* Author: Moises Bernal
* Date: 3-5-2018
*/
var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var path = require('path');
const PORT=2000;
server = http.Server(app);

function toDownload (res, filePath, remove) {
    res.download(filePath);
    remove();
}

app.get(/.*/, function(req, res){
    var filePath = path.join(__dirname, ('pdf/' + req.url));
    var file_type = filePath.substr(filePath.lastIndexOf('.')).toLowerCase();

    // serving request for index.html
    if(req.url === '/')
    {
        fs.readFile(__dirname + '/404.html', 'UTF-8', function(err,html){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        });
    }
    else if (req.url.match("\.css$"))
    {
        // serving request for css files
        var fileStream = fs.createReadStream(__dirname + req.url, "UTF-8");
        res.writeHead(200, {'Content-Type': 'text/css'});
        fileStream.pipe(res);
    }
    else if (req.url.match("\.png$"))
    {
        // serving request for png files
        var fileStream = fs.createReadStream(__dirname + req.url);
        res.writeHead(200, {'Content-Type': 'text/png'});
        fileStream.pipe(res);
    }
    else if (req.url.match("\.js$"))
    {
        // serving request for js files
        var fileStream = fs.createReadStream(__dirname + req.url);
        res.writeHead(200, {'Content-Type': 'text/js'});
        fileStream.pipe(res);
    }
    else if (req.url.match("\.txt$"))
    {
        // serving request for text files
        var fileStream = fs.createReadStream(__dirname + req.url);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        fileStream.pipe(res);
    }
    else if (fs.existsSync(filePath) && req.url.match("\.pdf$")) {
        var file = fs.createReadStream(filePath);
        /*fs.readFile(filePath, function(err,pdf){
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Length': fs.statSync(filePath).size});
            res.end(pdf);
        });*/
        res.download(filePath);
        file.on('end', function() {
            try {
                fs.unlinkSync(filePath);
                console.log('successfully deleted ' + filePath);
            } catch (err) {
                console.log('file already deleted');
            }
        });
        file.pipe(res);
    }
    else{
        fs.readFile(__dirname + '/404.html', 'UTF-8', function(err,html){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        });
    }
});

server.listen(PORT);
console.log('Listening to port ' + PORT);