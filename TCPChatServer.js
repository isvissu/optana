// {{{ Loading the TCP Lib
net = require('net');
//}}}
//{{{ the list of the clients
var clients = [];
//}}}
//{{{ the server code
net.createServer(function (socket) {
   socket.name = socket.remoteAddress + ":" + socket.remotePort;
   clients.push(socket);
   socket.write( "This is eve how can I help you " + socket.name + "?\n");
   broadcast(socket.name + " has joined the cartel\n",socket);
   socket.on('data',function (data) {
      broadcast(socket.name + ">" + data , socket);
   } );
   socket.on('end' , function () {
      clients.splice(clients.indexOf(socket),1);
      broadcast(socket.name + "has left the cartel.\n");
   });
   function broadcast(message,sender) {
      clients.forEach(function ( client) {
         if( client === sender) client.write(message+"\nsent\n"); return;
         client.write(message);
      } );
      process.stdout.write(message);
   }
}).listen(8000);
// port off set }}}
// {{{ the cartel info
console.log("cartel is runnig on the port 8080\n");
// }}}
