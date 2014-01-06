var tls = require("tls"),
    net = require("net"),
    crypto = require("crypto"),
    fs = require("fs"),
    credentials = crypto.createCredentials({
        key: fs.readFileSync(__dirname + "/server.key", "utf-8"),
        cert: fs.readFileSync(__dirname + "/server.crt", "utf-8")
    });

var server = net.createServer(function(socket){

    var secure = new tls.TLSSocket(socket, {
        credentials: credentials,
        isServer: true,
        rejectUnauthorized: false
    });

    secure.on("data", function(chunk){
        console.log("Server received: " + chunk.toString().trim());
        secure.end();
        server.close();
    });

    secure.on("secure", function(){
        console.log("Server secured");
        secure.write("Hello!\r\n");
    });

});

server.listen(8124, function(){
    console.log('Server bound');

    var client = net.connect({port: 8124}, function(){

        var secure = tls.connect({
            socket: client,
            rejectUnauthorized: false
        });

        secure.on("data", function(chunk){
            console.log("Client received: " + chunk.toString().trim());
            secure.write("World!\r\n");
        });

        secure.on("secure", function(){
            console.log("Client secured");
        });

    });
});
