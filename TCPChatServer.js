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
      //{{{ specfic code for heart beat packet
      else if(ProtocalNumber == "13"){
      var TerminalInformationContent = str.substring(8,10);
      var VoltageLevel = str.substring(10,12);
      var SGMSignalStrength = str.substring(12,14);
      var TimeZonePort = str.substring(14,18);
      var InformationSerialNumber = str.substring(18,22);
      var ErrorCheck = str.substring(22,26);
      var StopBit = str.substring(26,30);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Terminal Information Content : "+TerminalInformationContent+"\n SGM Signal Strength : "+SGMSignalStrength+"\n TimeZone and Port code : "+TimeZonePort+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for Location packet
      else if(ProtocalNumber == "22"){
      var DateTime = str.substring(8,20);
      var QualityOfGPSSignal = str.substring(20,22);
      var Latitude = str.substring(22,30);
      var Longitude = str.substring(30,38);
      var Speed = str.substring(38,42);
      var CourseStatus = str.substring(42,44);
      var MCC = str.substring(44,48);
      var MNC = str.substring(48,50);
      var LAC = str.substring(50,54);
      var CELLID = str.substring(54,60);
      var ACC = str.substring(60,62);
      var DataUploadMode = str.substring(62,64);
      var GPSRealTimeReUpload = str.substring(64,68);
      var Mileage = str.substring(68,76);
      var InformationSerialNumber = str.substring(76,82);
      var ErrorCheck = str.substring(82,86);
      var StopBit = str.substring(86,90);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n DateTime : "+DateTime+"\n Quality of the GPS signal : "+QualityOfGPSSignal+"\n Latitude :"+Latitude+"\n Longitude : "+Longitude+"\n Speed : "+Speed+"\n CourseStatus : "+CourseStatus+"\n MCC : "+MCC+"\n MNC : "+MNC+"\n LAC : "+LAC+"\n CELL ID : "+CELLID+"\n ACC : "+ACC+"\n DataUploadMode : "+DataUploadMode+"\n GPS Real Time Re-Upload : "+GPSRealTimeReUpload+"\n Mileage : "+Mileage+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for LBS Multiple Base Extension Packet
      else if(ProtocalNumber == "28"){
      var DateTime = str.substring(8,20);
      var MCC = str.substring(20,24);
      var MNC = str.substring(24,26);
      var LAC = str.substring(26,30);
      var CI  = str.substring(30,36);
      var RSSI = str.substring(36,38);
      var NLAC1 = str.substring(38,42);
      var NCI1 = str.substring(42,48);
      var NRSSI1 = str.substring(48,50);
      var NLAC2 = str.substring(50,54);
      var NCI2 = str.substring(54,60);
      var NRSSI2 = str.substring(60,62);
      var NLAC3 = str.substring(62,64);
      var NCI3 = str.substring(64,70);
      var NRSSI3 = str.substring(70,72);
      var NLAC4 = str.substring(72,74);
      var NCI4 = str.substring(74,80);
      var NRSSI4 = str.substring(80,82);
      var NLAC5 = str.substring(82,84);
      var NCI5 = str.substring(84,90);
      var NRSSI5 = str.substring(90,92);
      var NLAC6 = str.substring(92,94);
      var NCI6 = str.substring(94,100);
      var NRSSI6 = str.substring(100,102);
      var TimingAdvance = str.substring(102,104);
      var Language = str.substring(104,108);
      var InformationSerialNumber = str.substring(108,112);
      var ErrorCheck = str.substring(112,116);
      var StopBit = str.substring(116,120);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n DateTime : "+DateTime+"\n MCC : "+MCC+"\n MNC : "+MNC+"\n LAC"+LAC+"\n CI : "+CI+"\n RSSI : "+RSSI+"\n LAC1"+LAC1+"\n CI1 : "+CI1+"\n RSSI1 : "+RSSI1+"\n LAC2"+LAC2+"\n CI2 : "+CI2+"\n RSSI2 : "+RSSI2+"\n LAC3"+LAC3+"\n CI3 : "+CI3+"\n RSSI3 : "+RSSI3+"\n LAC4"+LAC4+"\n CI4 : "+CI4+"\n RSSI4 : "+RSSI4+"\n LAC5"+LAC5+"\n CI5 : "+CI5+"\n RSSI5 : "+RSSI5+"\n LAC6"+LAC6+"\n CI6 : "+CI6+"\n RSSI6 : "+RSSI6+"\n TimingAdvance : "+TimingAdvance+"\n Language : "+Language+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for Alarm Packet Sent by Terminal One Fence
      else if(ProtocalNumber == "26"){
      var DateTime = str.substring(8,20);
      var QualityOfGPSSignal = str.substring(20,22);
      var Latitude = str.substring(22,30);
      var Longitude = str.substring(30,38);
      var Speed = str.substring(38,40);
      var CourseStatus = str.substring(40,44);
      var LBSLength = str.substring(44,46);
      var MCC = str.substring(46,50);
      var MNC = str.substring(50,52);
      var LAC = str.substring(52,56);
      var CELLID = str.substring(56,62);
      var TerminalInformation = str.substring(62,64);
      var VoltageLevel = str.substring(64,66);
      var GSMSignalStrength = str.substring(66,68);
      var AlarmLanguage = str.substring(68,72);
      var InformationSerialNumber = str.substring(72,76);
      var ErrorCheck = str.substring(76,80);
      var StopBit = str.substring(80,84);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n DateTime : "+DateTime+"\n Quality of the GPS signal : "+QualityOfGPSSignal+"\n Latitude :"+Latitude+"\n Longitude : "+Longitude+"\n Speed : "+Speed+"\n CourseStatus : "+CourseStatus+"\n LBSLength : "+LBSLength+"\n MCC : "+MCC+"\n MNC : "+MNC+"\n LAC : "+LAC+"\n CELL ID : "+CELLID+"\n TerminalInformation : "+TerminalInformation+"\n VoltageLevel : "+VoltageLevel+"\n GSMSignalStrength : "+GSMSignalStrength+"\n AlarmLanguage : "+AlarmLanguage+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
     //{{{ specfic code for Alarm Packet Sent by Terminal Many Fence
      else if(ProtocalNumber == "27"){
      var DateTime = str.substring(8,20);
      var QualityOfGPSSignal = str.substring(20,22);
      var Latitude = str.substring(22,30);
      var Longitude = str.substring(30,38);
      var Speed = str.substring(38,40);
      var CourseStatus = str.substring(40,44);
      var LBSLength = str.substring(44,46);
      var MCC = str.substring(46,50);
      var MNC = str.substring(50,52);
      var LAC = str.substring(52,56);
      var CELLID = str.substring(56,62);
      var TerminalInformation = str.substring(62,64);
      var VoltageLevel = str.substring(64,66);
      var GSMSignalStrength = str.substring(66,68);
      var AlarmLanguage = str.substring(68,72);
      var FenceNumber = str.substring(72,74);
      var InformationSerialNumber = str.substring(74,78);
      var ErrorCheck = str.substring(78,82);
      var StopBit = str.substring(82,86);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n DateTime : "+DateTime+"\n Quality of the GPS signal : "+QualityOfGPSSignal+"\n Latitude :"+Latitude+"\n Longitude : "+Longitude+"\n Speed : "+Speed+"\n CourseStatus : "+CourseStatus+"\n LBSLength : "+LBSLength+"\n MCC : "+MCC+"\n MNC : "+MNC+"\n LAC : "+LAC+"\n CELL ID : "+CELLID+"\n TerminalInformation : "+TerminalInformation+"\n VoltageLevel : "+VoltageLevel+"\n GSMSignalStrength : "+GSMSignalStrength+"\n AlarmLanguage : "+AlarmLanguage+"\n FenceNumber : "+FenceNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for english Responce of Server address alarm packet
      if(ProtocalNumber == "17"){
      var LengthOfCommand = parseInt(str.substring(8,10));
      var ServerFlagBit = str.substring(10,18);
      var ADDRESS = str.substring(18,32);
      var grabage1 = str.substring(32,36);
      var AddressContent = str.substring(36,36+LengthOfCommand);
      var grabage2 = str.substring(36 + LengthOfCommand,38 + LengthOfCommand);
      var PhoneNumber = str.substring(38 + LengthOfCommand , 80 + LengthOfCommand);
      var grabage3 = str.substring(80 + LengthOfCommand, 82 + LengthOfCommand);
      var InformationSerialNumber = str.substring(82 + LengthOfCommand , 86 + LengthOfCommand);
      var ErrorCheck = str.substring(86 + LengthOfCommand,90 + LengthOfCommand);
      var StopBit = str.substring(90 + LengthOfCommand,94 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for chinese Responce of Server address alarm packet
      if(ProtocalNumber == "17"){
      var LengthOfCommand = parseInt(str.substring(8,10));
      var ServerFlagBit = str.substring(10,18);
      var ADDRESS = str.substring(18,32);
      var grabage1 = str.substring(32,36);
      var AddressContent = str.substring(36,36+LengthOfCommand);
      var grabage2 = str.substring(36 + LengthOfCommand,38 + LengthOfCommand);
      var PhoneNumber = str.substring(38 + LengthOfCommand , 80 + LengthOfCommand);
      var grabage3 = str.substring(80 + LengthOfCommand, 82 + LengthOfCommand);
      var InformationSerialNumber = str.substring(82 + LengthOfCommand , 86 + LengthOfCommand);
      var ErrorCheck = str.substring(86 + LengthOfCommand,90 + LengthOfCommand);
      var StopBit = str.substring(90 + LengthOfCommand,94 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for GPS Address Request packet
      else if(ProtocalNumber == "26"){
      var DateTime = str.substring(8,20);
      var QualityOfGPSSignal = str.substring(20,22);
      var Latitude = str.substring(22,30);
      var Longitude = str.substring(30,38);
      var Speed = str.substring(38,40);
      var CourseStatus = str.substring(40,44);
      var PhoneNumber = str.substring(44,86);
      var ErrorCheck = str.substring(86,90);
      var StopBit = str.substring(90,94);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n DateTime : "+DateTime+"\n Quality of the GPS signal : "+QualityOfGPSSignal+"\n Latitude :"+Latitude+"\n Longitude : "+Longitude+"\n Speed : "+Speed+"\n CourseStatus : "+CourseStatus+"\n PhoneNumber :"+PhoneNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
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
