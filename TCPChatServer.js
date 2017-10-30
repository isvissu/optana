// {{{ Loading the TCP Lib
net = require('net');
lora_packet = require('lora-packet');
//}}}
//{{{ the list of the clients
var clients = [];
//}}}
//{{{ parsing the packet information
//}}}
//{{{ the server code
net.createServer(function (socket) {
   socket.name = socket.remoteAddress + ":" + socket.remotePort;
   clients.push(socket);
   //socket.write( "This is eve how can I help you " + socket.name + "?\n");
   //broadcast(socket.name + " has joined the cartel\n",socket);
   socket.on('data',function (data) {
      var packet = lora_packet.fromWire( data ,'hex');
      var str = packet._packet.PHYPayload.toString('hex');
      var StartBit = str.substring(0,4);
      var PacketLength = str.substring(4,6);
      var ProtocalNumber = str.substring(6,8);
      //{{{ specfic code for login packet
      if(ProtocalNumber == "01"){
      var TerminalID = str.substring(8,26);
      var ModelIDCode = str.substring(26,30);
      var TimeZoneLang = str.substring(30,34);
      var InformationSerialNumber = str.substring(34,36);
      var ErrorCheck = str.substring(36,40);
      var StopBit = str.substring(40,44);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Terminal ID : "+TerminalID+"\n model Identification Code : "+ModelIDCode+"\n TimeZone and Language code : "+TimeZoneLang+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for login packet
      else if(ProtocalNumber == "01"){
      var TerminalID = str.substring(8,26);
      var ModelIDCode = str.substring(26,30);
      var TimeZoneLang = str.substring(30,34);
      var InformationSerialNumber = str.substring(34,36);
      var ErrorCheck = str.substring(36,40);
      var StopBit = str.substring(40,44);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Terminal ID : "+TerminalID+"\n model Identification Code : "+ModelIDCode+"\n TimeZone and Language code : "+TimeZoneLang+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}


      //broadcast(socket.name + ">" + data , socket);
   } );
   socket.on('end' , function () {
      clients.splice(clients.indexOf(socket),1);
     //broadcast(socket.name + "has left the cartel.\n");
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
console.log("cartel is runnig on the port 8000\n");
// }}}
