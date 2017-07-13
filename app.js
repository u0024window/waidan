/**
 * @overview
 *
 * @author
 * @version 2016/10/12
 */

var path = require('path');
var http = require('http');
var server = require('bdj-container/index-2.js');
var program = require('commander');

program
    .option('-p, --port <n>', 'server port, An integer argument', parseInt)
    .parse(process.argv);

var app = server.createApp({
    "publicPath": path.join(__dirname, "./public"),
    "appPath": path.join(__dirname, "./app"),
    "port": program.port || 8080
});

http.createServer(app).listen(app.get('port'), function(){
    console.info('Express server listening on port ' + app.get('port'));
});

