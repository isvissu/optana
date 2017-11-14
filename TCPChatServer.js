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
      var codeOfsending = -1;
//{{{ CRCTab16
const CRCDic =[
0X0000,0X1189,0X2312,0X329B,0X4624,0X57AD,0X6536,0X74BF,
0X8C48,0X9DC1,0XAF5A,0XBED3,0XCA6C,0XDBE5,0XE97E,0XF8F7,
0X1081,0X0108,0X3393,0X221A,0X56A5,0X472C,0X75B7,0X643E,
0X9CC9,0X8D40,0XBFDB,0XAE52,0XDAED,0XCB64,0XF9FF,0XE876,
0X2102,0X308B,0X0210,0X1399,0X6726,0X76AF,0X4434,0X55BD,
0XAD4A,0XBCC3,0X8E58,0X9FD1,0XEB6E,0XFAE7,0XC87C,0XD9F5,
0X3183,0X200A,0X1291,0X0318,0X77A7,0X662E,0X54B5,0X453C,
0XBDCB,0XAC42,0X9ED9,0X8F50,0XFBEF,0XEA66,0XD8FD,0XC974,
0X4204,0X538D,0X6116,0X709F,0X0420,0X15A9,0X2732,0X36BB,
0XCE4C,0XDFC5,0XED5E,0XFCD7,0X8868,0X99E1,0XAB7A,0XBAF3,
0X5285,0X430C,0X7197,0X601E,0X14A1,0X0528,0X37B3,0X263A,
0XDECD,0XCF44,0XFDDF,0XEC56,0X98E9,0X8960,0XBBFB,0XAA72,
0X6306,0X728F,0X4014,0X519D,0X2522,0X34AB,0X0630,0X17B9,
0XEF4E,0XFEC7,0XCC5C,0XDDD5,0XA96A,0XB8E3,0X8A78,0X9BF1,
0X7387,0X620E,0X5095,0X411C,0X35A3,0X242A,0X16B1,0X0738,
0XFFCF,0XEE46,0XDCDD,0XCD54,0XB9EB,0XA862,0X9AF9,0X8B70,
0X8408,0X9581,0XA71A,0XB693,0XC22C,0XD3A5,0XE13E,0XF0B7,
0X0840,0X19C9,0X2B52,0X3ADB,0X4E64,0X5FED,0X6D76,0X7CFF,
0X9489,0X8500,0XB79B,0XA612,0XD2AD,0XC324,0XF1BF,0XE036,
0X18C1,0X0948,0X3BD3,0X2A5A,0X5EE5,0X4F6C,0X7DF7,0X6C7E,
0XA50A,0XB483,0X8618,0X9791,0XE32E,0XF2A7,0XC03C,0XD1B5,
0X2942,0X38CB,0X0A50,0X1BD9,0X6F66,0X7EEF,0X4C74,0X5DFD,
0XB58B,0XA402,0X9699,0X8710,0XF3AF,0XE226,0XD0BD,0XC134,
0X39C3,0X284A,0X1AD1,0X0B58,0X7FE7,0X6E6E,0X5CF5,0X4D7C,
0XC60C,0XD785,0XE51E,0XF497,0X8028,0X91A1,0XA33A,0XB2B3,
0X4A44,0X5BCD,0X6956,0X78DF,0X0C60,0X1DE9,0X2F72,0X3EFB,
0XD68D,0XC704,0XF59F,0XE416,0X90A9,0X8120,0XB3BB,0XA232,
0X5AC5,0X4B4C,0X79D7,0X685E,0X1CE1,0X0D68,0X3FF3,0X2E7A,
0XE70E,0XF687,0XC41C,0XD595,0XA12A,0XB0A3,0X8238,0X93B1,
0X6B46,0X7ACF,0X4854,0X59DD,0X2D62,0X3CEB,0X0E70,0X1FF9,
0XF78F,0XE606,0XD49D,0XC514,0XB1AB,0XA022,0X92B9,0X8330,
0X7BC7,0X6A4E,0X58D5,0X495C,0X3DE3,0X2C6A,0X1EF1,0X0F78
];

function U16GetCrc(pData,nLength){
var fcs = Buffer.from("0XFFFF","hex");//init u16fcs
var i = 0;
var d = Buffer.from(pData,"hex");
while( nLength > 0 ){
fcs.slice(0,1) = (fcs.slice(0,1)>>8)^CRCDic[ (fcs.slice(0,1)^d[i]) & 0xff ];
nLength--;
i++;
}

return ~fcs.slice(0,1);
}

//}}}
      //{{{ specfic code for 1.1 01 login packet ---+
      //78781101075253367890024270003201000512790D0A
      //=> 78 78 				 0- 4	start code
      //=> 11 * 4 => 44 			 4- 6	length
      //=> 01 => 				 6- 8	protocal number
      //=> 07 52 53 36 78 90 02 42 70 => 	 8-26	imei number
      //=> 00 32  				26-30	model Identification code
      //=> 01 00  				30-34	time zone and language
      //=> 05 12 				34-38 	this is the information serial number
      //=> 12 79 				38-42	error check
      //=> 0D 0A 				42-46	Stop Bit
      if(ProtocalNumber == "01" && PacketLength == "11"){
      var TerminalID = str.substring(8,26);
      var ModelIDCode = str.substring(26,30);
      var TimeZoneLang = str.substring(30,34);
      var InformationSerialNumber = str.substring(34,36);
      var ErrorCheck = str.substring(36,40);
      var StopBit = str.substring(40,44);
      var crc = U16GetCrc( str/*.substring(4,38)*/, 0x11 );
      var buff =Buffer.from(data,'hex');
      console.log("Data :"+data+"\nBinary data :"+buff[0].toString(2)+"\npacket data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Terminal ID : "+TerminalID+"\n model Identification Code : "+ModelIDCode+"\n TimeZone and Language code : "+TimeZoneLang+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n CRC :"+parseInt(crc));
      }
      //}}}
      //{{{ specfic code for 1.2 01 login packet Response ---+
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 01					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "01" && PacketLength == "05" ){
      var PacketLength = parseInt(str.substring(4,6));
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 2.1 13 heart beat packet ---+
      //78780A134004040001000FDCEE0D0A
      //=> 78 78 				 0- 4	start code
      //=> 0A					 4- 6	packet length
      //=> 13					 6- 8 	protocal number
      //=> 40					 8-10	Terminal Information Content
      //=> 04					10-12	Voltage Level
      //=> 04 				12-14	GSM Signal Strength
      //=> 00 01				14-18	Language / Extended Port Status
      //=> 00 0F				18-22	Serial Number
      //=> DC EE				22-26	Error Check
      //=> 0D 0A 				26-30	Stop Bit
      else if(ProtocalNumber == "13" && PacketLength == "0A"){
      var PacketLength = parseInt(str.substring(4,6));
      var TerminalInformationContent = str.substring(8,10);
      var VoltageLevel = str.substring(10,12);
      var SGMSignalStrength = str.substring(12,14);
      var TimeZonePort = str.substring(14,18);
      var InformationSerialNumber = str.substring(18,22);
      var ErrorCheck = str.substring(22,26);
      var StopBit = str.substring(26,30);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Terminal Information Content : "+TerminalInformationContent+"\n SGM Signal Strength : "+SGMSignalStrength+"\n TimeZone and Port code : "+TimeZonePort+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 2.2 13 Server Response Heart Beat Packet ---+
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 01					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "05" && PacketLength == "05"){
      var PacketLength = parseInt(str.substring(4,6));
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 3.1 22 Location packet ---+
      //787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
      //=> 78 78 				 0- 4	start code
      //=> 22					 4- 6	packet length
      //=> 22					 6- 8 	protocal number
      //=> 0F 0C 1D 02 33 05			 8-20	Date Time
      //=> 0F 0C 1D 02 33 05			20-22	Quantity of GPS Signal
      //=> C9	02 7A C8 			22-30	Latitude
      //=> 18 0C 46 58	         		30-38	Longitude
      //=> 60					38-40	Speed
      //=> 00 14				40-44	Course Status
      //=> 00 01				44-48	MCC
      //=> 02					48-50	MNC
      //=> 02					50-54	LAC
      //=> 02					54-60	CELL ID
      //=> 02					60-62	ACC
      //=> 02					62-64	Data Upload Mode
      //=> 02					64-66	GPS Real-Time Re-upload
      //=> 02					66-74	Mileage
      //=> 00 0F				74-78	Serial Number
      //=> DC EE				78-82	Error Check
      //=> 0D 0A 				82-86	Stop Bit
      else if(ProtocalNumber == "22" && PacketLength == "22"){
      var PacketLength = parseInt( str.substring(4,6));
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
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n DateTime : "+DateTime+"\n Quality of the GPS signal : "+QualityOfGPSSignal+"\n Latitude :"+Latitude+"\n Longitude : "+Longitude+"\n Speed : "+Speed+"\n CourseStatus : "+CourseStatus+"\n MCC : "+MCC+"\n MNC : "+MNC+"\n LAC : "+LAC+"\n CELL ID : "+CELLID+"\n ACC : "+ACC+"\n DataUploadMode : "+DataUploadMode+"\n GPS Real Time Re-Upload : "+GPSRealTimeReUpload+"\n Mileage : "+Mileage+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 4.a 28 LBS Multiple Base Extension Packet ---+
      //78783B2810010D02020201CC00287D001F713E287D001F7231287D001E232D287D001F4018
      //000000000000000000000000000000000000FF00020005B14B0D0A
      //=> 78 78 				 0- 4	start code
      //=> 3B					 4- 6	packet length
      //=> 28					 6- 8 	protocal number
      //=> 10 01 0D 02 02 02			 8-20	Date Time (UTC)
      //=> 01 CC				20-24	MCC
      //=> 00					24-26	MNC
      //=> 28 7D				26-30	LAC
      //=> 00 1F 72				30-36	CI
      //=> 31					36-38	RSSI
      //=> 28 7D				38-42 	NLAC1
      //=> 00 1E 23				42-48	NCI1
      //=> 2D					48-50 	NRSSI1
      //=> 28 7D				50-54 	NLAC2
      //=> 00 1F 40				54-60	NCI2
      //=> 18					60-62 	NRSSI2
      //=> 00					62-64	NLAC3
      //=> 00 00 00				64-70 	NCI3
      //=> 00					70-72 	NRSSI3
      //=> 00					72-74	NLAC4
      //=> 00 00 00				74-80	NCI4
      //=> 00					80-82	NRSSI4
      //=> 00					82-84	NLAC5
      //=> 00 00 00				84-90	NCI5
      //=> 00					90-92	NRSSI5
      //=> 00					92-94	NLAC6
      //=> 00 00 FF				94-100 	NCI6
      //=> 00				       100-102  NRSSI6
      //=> 02				       102-104  Timing Advance
      //=> 00 05			       104-108  LANGUAGE
      //=> 00				       108-112  Serial Number
      //=> 00				       112-116  Error Check
      //=> 0D 0A			       116-120  Stop Bit
      else if(ProtocalNumber == "28" && PacketLength == "3B"){
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
      //{{{ specfic code for 5.1 26 Alarm Packet Sent by Terminal One Fence ---+
      //787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
      //=> 78 78 				 0- 4	start code
      //=> 25					 4- 6	packet length
      //=> 26					 6- 8 	protocal number
      //=> 0F 0C 1D 03 0B			 8-20	Date Time (UTC)
      //=> 0B					20-22	Quantity of GPS Information Satellites
      //=> 26 C9 02 7A 	         		22-30	Latitude
      //=> C8 18 0C 46	         		30-38	Longitude
      //=> 58					38-40 	Speed
      //=> 60 00				40-44 	Course Status
      //=> 09					44-46 	LBS Length
      //=> 01 CC				46-50 	MCC
      //=> 00					50-52 	MNC
      //=> 28 7D				52-56 	LAC
      //=> 00 1F 71				56-62 	CELL ID
      //=> 80					62-64 	Terminal Information
      //=> 04					64-66 	Voltage Level
      //=> 04					66-68 	GSM Signal Strength
      //=> 13 02				68-72 	Alarm / Language
      //=> 00 0C				72-76 	Serial Number
      //=> 47 2A				76-80 	Error Check
      //=> 0D 0A				80-84 	Stop Bit
      else if(ProtocalNumber == "26" && PacketLength == "25"){
      var PacketLength = parseInt(str.substring(4,6));
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
     //{{{ specfic code for 5.1 27 Alarm Packet Sent by Terminal Many Fence ---+
      //787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
      // functions LBS Multiple Base Extension Packet
      //=> 78 78 				 0- 4	start code
      //=> 26					 4- 6	packet length
      //=> 27					 6- 8 	protocal number
      //=> 0F 0C 1D 03 0B			 8-20	Date Time (UTC)
      //=> 0B					20-22	Quantity of GPS Information Satellites
      //=> 26 C9 02 7A  			22-30	Latitude
      //=> C8 18 0C 46	         		30-38	Longitude
      //=> 58					38-40 	Speed
      //=> 60 00				40-44 	Course Status
      //=> 09					44-46 	LBS Length
      //=> 01 CC				46-50 	MCC
      //=> 00					50-52 	MNC
      //=> 28 7D				52-56 	LAC
      //=> 00 1F 71				56-62 	CELL ID
      //=> 80					62-64 	Terminal Information
      //=> 04					64-66 	Voltage Level
      //=> 04					66-68 	GSM Signal Strength
      //=> 13 02				68-72 	Alarm / Language
      //=> 00 0C				72-74 	Fence No.
      //=> 00 0C				74-78 	Serial Number
      //=> 47 2A				78-82 	Error Check
      //=> 0D 0A				82-86 	Stop Bit
      else if(ProtocalNumber == "27" && PacketLength == "26"){
      var PacketLength = parseInt(str.substring(4,6));
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
      //{{{ specfic code for 5.2 26 alarm packet Response of server ---+
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 26					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "26" && PacketLength == "05"){
      var PacketLength = parseInt(str.substring(4,6));
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 5.3 17 chinese Responce of Server address Alarm packet ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit (1+1+4+7+2+M+2+21+2+2+2)
      //=> 17					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command (2 + M) => D = 42
      //=> 0D 0A 				10-18	Server Flag Bit
      //=> 0D 0A 				18-34	ADDRESS
      //=> 0D 0A 				34-38	&&
      //=> 0D 0A 			*   38  -38+M	Address Content
      //=> 0D 0A 			*   38+M-42+M	&&
      //=> 0D 0A 			*   42+M-84+M	Phone Number
      //=> 0D 0A 			*   84+M-88+M	##
      //=> 0D 0A 			*   88+M-92+M	Serial Number
      //=> 0D 0A 			*   92+M-96+M	Error Check
      //=> 0D 0A 			*   96+M-100+M	Stop Bit
      if(ProtocalNumber == "17" && codeOfsending == 0 ){
      var DatabitLength = parseInt(str.substring(4,6));
      var CommandLength = parseInt(str.substring(8,10));
      var LengthOfCommand = parseInt(str.substring(4,6))-88;
      var ServerFlagBit = str.substring(10,18);
      var ADDRESS = str.substring(18,34);
      var grabage1 = str.substring(34,38);
      var AddressContent = str.substring(38,38+LengthOfCommand);
      var grabage2 = str.substring(38 + LengthOfCommand,42 + LengthOfCommand);
      var PhoneNumber = str.substring(42 + LengthOfCommand , 84 + LengthOfCommand);
      var grabage3 = str.substring(84 + LengthOfCommand, 88 + LengthOfCommand);
      var InformationSerialNumber = str.substring(88 + LengthOfCommand , 92 + LengthOfCommand);
      var ErrorCheck = str.substring(92 + LengthOfCommand,96 + LengthOfCommand);
      var StopBit = str.substring(96 + LengthOfCommand,100 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 5.4 97 english Responce of Server address Alarm packet ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit (1+1+4+7+2+M+2+21+2+2+2)
      //=> 97					 6-10 	protocal number
      //=> 99					10-12	Length of Command (2 + M) => D = 42
      //=> 0D 0A 				12-20	Server Flag Bit
      //=> 0D 0A 				20-36	ADDRESS
      //=> 0D 0A 				36-40	&&
      //=> 0D 0A 			*   40  -40+M	Address Content
      //=> 0D 0A 			*   40+M-44+M	&&
      //=> 0D 0A 			*   44+M-86+M	Phone Number
      //=> 0D 0A 			*   86+M-90+M	##
      //=> 0D 0A 			*   90+M-94+M	Serial Number
      //=> 0D 0A 			*   94+M-98+M	Error Check
      //=> 0D 0A 			*   98+M-102+M	Stop Bit
      if(ProtocalNumber == "97" && codeOfsending == 0){
      var DatabitLength = parseInt(str.substring(4,6));
      var CommandLength = parseInt(str.substring(10,12));
      var LengthOfCommand = parseInt(str.substring(4,6))-88;
      var ServerFlagBit = str.substring(12,20);
      var ADDRESS = str.substring(20,36);
      var grabage1 = str.substring(36,40);
      var AddressContent = str.substring(40,40+LengthOfCommand);
      var grabage2 = str.substring(40 + LengthOfCommand,44 + LengthOfCommand);
      var PhoneNumber = str.substring(44 + LengthOfCommand , 86 + LengthOfCommand);
      var grabage3 = str.substring(86 + LengthOfCommand, 90 + LengthOfCommand);
      var InformationSerialNumber = str.substring(90 + LengthOfCommand , 94 + LengthOfCommand);
      var ErrorCheck = str.substring(94 + LengthOfCommand,98 + LengthOfCommand);
      var StopBit = str.substring(98 + LengthOfCommand,102 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 6.1 2A Terminal Address Request packet ---+
      //78782E2A0F0C1D071139CA027AC8000C4658000014D8313235323031333533
      //3231373730373900000000000001002A6ECE0D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 2A					 6- 8 	protocal number
      //=> 0F 0C 1D 03 0B			 8-20	Date Time (UTC)
      //=> 0B					20-22	Quantity of GPS Information Satellites
      //=> 26 C9 02 7A  			22-30	Latitude
      //=> C8 18 0C 46	         		30-38	Longitude
      //=> 58					38-40 	Speed
      //=> 60 00				40-44 	Course Status
      //					44-86	Phone Number
      //					86-90	Alarm Language
      //=> 9D 86				90-94	Error Check
      //=> 0D 0A 				94-98	Stop Bit

      else if(ProtocalNumber == "2A" && PacketLength == "2E"){
      var PacketLength = parseInt(ste.substring(4,6));
      var DateTime = str.substring(8,20);
      var QualityOfGPSSignal = str.substring(20,22);
      var Latitude = str.substring(22,30);
      var Longitude = str.substring(30,38);
      var Speed = str.substring(38,40);
      var CourseStatus = str.substring(40,44);
      var PhoneNumber = str.substring(44,86);
      var ErrorCheck = str.substring(86,90);
      var StopBit = str.substring(90,94);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n DateTime : "+DateTime+"\n Quality of the GPS signal : "+QualityOfGPSSignal+"\n Latitude :"+Latitude+"\n Longitude : "+Longitude+"\n Speed : "+Speed+"\n CourseStatus : "+CourseStatus+"\n PhoneNumber :"+PhoneNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 6.2 17 chinese Responce of Server address Request packet ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit (1+1+4+7+2+M+2+21+2+2+2)
      //=> 17					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command (M+2) D = 42
      //=> 0D 0A 				10-18	Server Flag Bit
      //=> 0D 0A 				18-32	ADDRESS
      //=> 0D 0A 				32-36	&&
      //=> 0D 0A 			*   36  -36+M	Address Content
      //=> 0D 0A 			*   36+M-40+M	&&
      //=> 0D 0A 			*   40+M-82+M	Phone Number
      //=> 0D 0A 			*   82+M-86+M	##
      //=> 0D 0A 			*   86+M-90+M	Serial Number
      //=> 0D 0A 			*   90+M-94+M	Error Check
      //=> 0D 0A 			*   94+M-98+M	Stop Bit
      if(ProtocalNumber == "17" && codeOfsending == 1){
      var LengthOfCommand = parseInt(str.substring(4,6))-88;
      var ServerFlagBit = str.substring(10,18);
      var ADDRESS = str.substring(18,32);
      var grabage1 = str.substring(32,36);
      var AddressContent = str.substring(36,36+LengthOfCommand);
      var grabage2 = str.substring(36 + LengthOfCommand,40 + LengthOfCommand);
      var PhoneNumber = str.substring(40 + LengthOfCommand , 82 + LengthOfCommand);
      var grabage3 = str.substring(82 + LengthOfCommand, 86 + LengthOfCommand);
      var InformationSerialNumber = str.substring(86 + LengthOfCommand , 90 + LengthOfCommand);
      var ErrorCheck = str.substring(90 + LengthOfCommand,94 + LengthOfCommand);
      var StopBit = str.substring(94 + LengthOfCommand,98 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 6.3 97 english Responce of Server address Request packet ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 8	Length of data bit (1+1+4+7+2+M+2+21+2+2+2)
      //=> 97					 8-10 	protocal number
      //=> 99					10-12	Length of Command (2+M) D = 42
      //=> 0D 0A 				12-20	Server Flag Bit
      //=> 0D 0A 				20-34	ADDRESS
      //=> 0D 0A 				34-38	&&
      //=> 0D 0A 			*   38  -38+M	Address Content
      //=> 0D 0A 			*   38+M-42+M	&&
      //=> 0D 0A 			*   42+M-84+M	Phone Number
      //=> 0D 0A 			*   84+M-88+M	##
      //=> 0D 0A 			*   88+M-92+M	Serial Number
      //=> 0D 0A 			*   92+M-96+M	Error Check
      //=> 0D 0A 			*   96+M-98+M	Stop Bit
      if(ProtocalNumber == "97" && codeOfsending == 1){
      var LengthOfCommand = parseInt(str.substring(4,8))-88;
      var ServerFlagBit = str.substring(12,20);
      var ADDRESS = str.substring(20,34);
      var grabage1 = str.substring(34,38);
      var AddressContent = str.substring(38,38+LengthOfCommand);
      var grabage2 = str.substring(38 + LengthOfCommand,42 + LengthOfCommand);
      var PhoneNumber = str.substring(42 + LengthOfCommand , 84 + LengthOfCommand);
      var grabage3 = str.substring(84 + LengthOfCommand, 88 + LengthOfCommand);
      var InformationSerialNumber = str.substring(88 + LengthOfCommand , 92 + LengthOfCommand);
      var ErrorCheck = str.substring(92 + LengthOfCommand,96 + LengthOfCommand);
      var StopBit = str.substring(96 + LengthOfCommand,98 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 7.1 17 Terminal Address Request Packet ---+
      //787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
      //=> 78 78 				 0- 4	start code
      //=> 22					 4- 6	packet length
      //=> 17					 6- 8 	protocal number
      //=> 00 01				 8-12	MCC
      //=> 02					12-14	MNC
      //=> 02					14-18	LAC
      //=> 02					18-24	CELL ID
      //=> 02					24-66	Phone Number
      //=> 00 0F				66-70	Alarm Language
      //=> 00 0F				70-74	Serial Number
      //=> DC EE				74-78	Error Check
      //=> 0D 0A 				78-82	Stop Bit
      else if(ProtocalNumber == "17" && PacketLength == "24"){
      var PacketLength = parseInt(str.substring(4,6));
      var MCC = str.substring(8,12);
      var MNC = str.substring(12,14);
      var LAC = str.substring(14,18);
      var CELLID = str.substring(18,24);
      var PhoneNumber = str.substring(24,66);
      var AlarmLanguage = str.substring(66,70);
      var InformationSerialNumber = str.substring(70,74);
      var ErrorCheck = str.substring(74,78);
      var StopBit = str.substring(78,82);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n MCC : "+MCC+"\n MNC : "+MNC+"\n LAC : "+LAC+"\n CELL ID : "+CELLID+"\n PhoneNumber :"+PhoneNumber+"\n AlarmLanguage : "+AlarmLanguage+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 7.2 17 chinese Responce of Server address Request packet ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit (1+1+4+7+2+M+2+21+2+2+2)
      //=> 17					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command (2+M) => D = 42
      //=> 0D 0A 				10-18	Server Flag Bit
      //=> 0D 0A 				18-32	ADDRESS
      //=> 0D 0A 				32-36	&&
      //=> 0D 0A 			*   36  -36+M	Address Content
      //=> 0D 0A 			*   36+M-40+M	&&
      //=> 0D 0A 			*   40+M-82+M	Phone Number
      //=> 0D 0A 			*   82+M-86+M	##
      //=> 0D 0A 			*   86+M-90+M	Serial Number
      //=> 0D 0A 			*   90+M-94+M	Error Check
      //=> 0D 0A 			*   94+M-98+M	Stop Bit
      if(ProtocalNumber == "17" && codeOfsending == 2){
      var LengthOfCommand = parseInt(str.substring(4,6))-88;
      var ServerFlagBit = str.substring(10,18);
      var ADDRESS = str.substring(18,32);
      var grabage1 = str.substring(32,36);
      var AddressContent = str.substring(36,36+LengthOfCommand);
      var grabage2 = str.substring(36 + LengthOfCommand,40 + LengthOfCommand);
      var PhoneNumber = str.substring(40 + LengthOfCommand , 82 + LengthOfCommand);
      var grabage3 = str.substring(82 + LengthOfCommand, 86 + LengthOfCommand);
      var InformationSerialNumber = str.substring(86 + LengthOfCommand , 90 + LengthOfCommand);
      var ErrorCheck = str.substring(90 + LengthOfCommand,94 + LengthOfCommand);
      var StopBit = str.substring(94 + LengthOfCommand,98 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 7.3 97 english Responce of Server address Request packet ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 8	Length of data bit (1+1+4+7+2+M+2+21+2+2+2)
      //=> 97					 8-10 	protocal number
      //=> 99					10-12	Length of Command (2+M) => D = 42
      //=> 0D 0A 				12-20	Server Flag Bit
      //=> 0D 0A 				20-34	ADDRESS
      //=> 0D 0A 				34-38	&&
      //=> 0D 0A 			*   38  -38+M	Address Content
      //=> 0D 0A 			*   38+M-42+M	&&
      //=> 0D 0A 			*   42+M-84+M	Phone Number
      //=> 0D 0A 			*   84+M-88+M	##
      //=> 0D 0A 			*   88+M-92+M	Serial Number
      //=> 0D 0A 			*   92+M-96+M	Error Check
      //=> 0D 0A 			*   96+M-98+M	Stop Bit
      if(ProtocalNumber == "97" && codeOfsending == 2){
      var LengthOfCommand = parseInt(str.substring(4,8))-88;
      var ServerFlagBit = str.substring(12,20);
      var ADDRESS = str.substring(20,34);
      var grabage1 = str.substring(34,38);
      var AddressContent = str.substring(38,38+LengthOfCommand);
      var grabage2 = str.substring(38 + LengthOfCommand,42 + LengthOfCommand);
      var PhoneNumber = str.substring(42 + LengthOfCommand , 84 + LengthOfCommand);
      var grabage3 = str.substring(84 + LengthOfCommand, 88 + LengthOfCommand);
      var InformationSerialNumber = str.substring(88 + LengthOfCommand , 92 + LengthOfCommand);
      var ErrorCheck = str.substring(92 + LengthOfCommand,96 + LengthOfCommand);
      var StopBit = str.substring(96 + LengthOfCommand,98 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ADDRESS : "+ADDRESS+"\n grabage1 : "+grabage1+"\n AddressContent : "+AddressContent+"\n AddressContent : "+AddressContent+"\n grabage2 : "+grabage2+"\n PhoneNumber : "+PhoneNumber+"\n grabage3 : "+grabage3+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 8.1 80 Online command sent by server ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit (1 + 1 + 4 + M + 2 + 2 + 2)
      //=> 80					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command (2+M) => D = 10
      //=> 0D 0A 				10-18	Server Flag Bit
      //=> 0D 0A 			*   18  -18+M	Command Content
      //=> 0D 0A 			*   18+M-22+M	Language
      //=> 0D 0A 			*   22+M-26+M	Serial Number
      //=> 0D 0A 			*   26+M-30+M	Error Check
      //=> 0D 0A 			*   30+M-34+M	Stop Bit
      if(ProtocalNumber == "80"){
      var LengthOfCommand = parseInt(str.substring(4,6)) -24;
      var ServerFlagBit = str.substring(10,18);
      var CommandContent = str.substring(18,18+LengthOfCommand);
      var Language = str.substring(18 + LengthOfCommand,22 + LengthOfCommand);
      var InformationSerialNumber = str.substring(22 + LengthOfCommand , 26 + LengthOfCommand);
      var ErrorCheck = str.substring(26 + LengthOfCommand, 30 + LengthOfCommand);
      var StopBit = str.substring(30 + LengthOfCommand , 34 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n CommandContent : "+CommandContent+"\n Language : "+Language+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 8.2 21 Online command replied by terminal ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit ( 1 + 4 + 1 + M + 2 + 2 )
      //=> 21					 6- 8 	protocal number
      //=> 0D 0A 				 8-16	Server Flag Bit
      //=> 0D 0A 			*       16-18   Content Code
      //=> 0D 0A 			*   18  -18+M   Content
      //=> 0D 0A 			*   18+M-22+M	Serial Number
      //=> 0D 0A 			*   22+M-26+M	Error Check
      //=> 0D 0A 			*   26+M-30+M	Stop Bit
      if(ProtocalNumber == "21"){
      var LengthOfCommand = parseInt(str.substring(4,6)) - 20;
      var ServerFlagBit = str.substring(8,16);
      var ContentCode = str.substring(16,18);
      var Content = str.substring(18,18+LengthOfCommand);
      var InformationSerialNumber = str.substring(18 + LengthOfCommand , 22 + LengthOfCommand);
      var ErrorCheck = str.substring(22 + LengthOfCommand,26 + LengthOfCommand);
      var StopBit = str.substring(26 + LengthOfCommand,30 + LengthOfCommand);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"\n ServerFlagBit : "+ServerFlagBit+"\n ContentCode : "+ContentCode+"\n Content : "+Content+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 9.2 8A Time Request Sent By Terminal ---+
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 26					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "8A" && PacketLength == "05"){
      var PacketLength = str.substring(4,6);
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 9.3 8A Server Responce Time Information ---+
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 8A					 6- 8 	protocal number
      //=> 00 05				 8-20	Information Content
      //=> 00 05				20-24	Information Serial Number
      //=> 9F F8				24-28	Error Check
      //=> 0D 0A 				28-32	Stop Bit
      if(ProtocalNumber == "8A" && PacketLength == "0B"){
      var PacketLength = parseInt( str.substring(4,6));
      var InformationContent = str.substring(8,20);
      var InformationSerialNumber = str.substring(20,24);
      var ErrorCheck = str.substring(24,28);
      var StopBit = str.substring(28,32);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n InformationContent : "+InformationContent+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for A.2 94 Information Transmission Packet Sent by terminal ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit (1+1+M+2+2)
      //=> 94					 6- 8 	protocal number
      //=> 0D 0A 				 8-10	Information Type
      //=> 0D 0A 			*   10  -10+M   Data Content
      //=> 0D 0A 			*   10+M-14+M	Serial Number
      //=> 0D 0A 			*   14+M-18+M	Error Check
      //=> 0D 0A 			*   18+M-22+M	Stop Bit
      if(ProtocalNumber == "94"){
      var LengthOfCommand = parseInt(str.substring(4,6)) - 12;
      var InformationType = str.substring(8,10);
      var DataContent = str.substring(10,10+LengthOfCommand);
      var InformationSerialNumber = str.substring(10 + LengthOfCommand , 14 + LengthOfCommand);
      var ErrorCheck = str.substring(14 + LengthOfCommand,18+ LengthOfCommand);
      var StopBit = str.substring(18 + LengthOfCommand,22 + LengthOfCommand);
      console.log(" packet data:\n packet sent by terminal: "+str+"\n Start Bit : "+StartBit+"\n Protocol Number : "+ProtocalNumber+"\n LengthOfCommand : "+LengthOfCommand+"InformationType"+InformationType+"\n DataContent : "+DataContent+"\n InformationSerialNumber :"+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
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
}).listen(8080);
// port off set }}}
// {{{ the cartel info
console.log("cartel is runnig on the port 8000\n");
// }}}
