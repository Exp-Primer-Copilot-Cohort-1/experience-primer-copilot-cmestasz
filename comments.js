// Create web server
// 
// 1. Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var comments = require('./comments.json');

// 2. Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    console.log(path);
    switch (path) {
        case '/':
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write('<h1>Hello World</h1>');
            response.end();
            break;
        case '/comments':
            switch (request.method) {
                case 'GET':
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.write(JSON.stringify(comments));
                    response.end();
                    break;
                case 'POST':
                    var body = '';
                    request.on('data', function (data) {
                        body += data;
                        if (body.length > 1e6) {
                            request.connection.destroy();
                        }
                    });
                    request.on('end', function () {
                        var post = qs.parse(body);
                        comments.push(post);
                        fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
                            if (err) throw err;
                            console.log('It\'s saved!');
                        });
                    });
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.write(JSON.stringify(comments));
                    response.end();
                    break;
            }
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

// 3. Listen on port 8000, IP defaults to