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
      //78781101075253367890024270003201000512790D0A
      //=> 78 78 				 0- 4	start code
      //=> 11 * 4 => 44 			 4- 6	length
      //=> 01 => 				 6- 8	protocal number
      //=> 07 52 53 36 78 90 02 42 70 => 	 8-26	imei number
      //=> 00 32  				26-30	model Identification code
      //=> 01 00  				30-34	time zone and language
      //=> 05 12 				34-36 	this is the information serial number
      //=> 12 79 				36-40	error check
      //=> 0D 0A 				40-44	Stop Bit
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
      //{{{ specfic code for login packet Response
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 01					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "01"){
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for heart beat packet
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
      //{{{ specfic code for Server Response Heart Beat Packet
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 01					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "05"){
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for Location packet
      //787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
      //=> 78 78 				 0- 4	start code
      //=> 22					 4- 6	packet length
      //=> 22					 6- 8 	protocal number
      //=> 0F 0C 1D 02 33 05			 8-20	Date Time
      //=> 0F 0C 1D 02 33 05			20-22	Quantity of GPS Signal
      //=> C9	02 7A C8 			22-30	Latitude
      //=> 18 0C 46 58	         		30-38	Longitude
      //=> 60					38-42	Speed
      //=> 00 14				42-44	Course Status
      //=> 00 01				44-48	MCC
      //=> 02					48-50	MNC
      //=> 02					50-54	LAC
      //=> 02					54-60	CELL ID
      //=> 02					60-62	ACC
      //=> 02					62-64	Data Upload Mode
      //=> 02					64-68	GPS Real-Time Re-upload
      //=> 02					68-76	Mileage
      //=> 00 0F				76-82	Serial Number
      //=> DC EE				82-86	Error Check
      //=> 0D 0A 				86-90	Stop Bit
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
      //{{{ specfic code for alarm packet Response of server
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 01					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "26"){
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for english Responce of Server address alarm packet
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit
      //=> 17					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command => M
      //=> 0D 0A 				10-18	Server Flag Bit
      //=> 0D 0A 				18-32	ADDRESS
      //=> 0D 0A 				32-36	&&
      //=> 0D 0A 			*   36  -36+M	Address Content
      //=> 0D 0A 			*   36+M-38+M	&&
      //=> 0D 0A 			*   38+M-80+M	Phone Number
      //=> 0D 0A 			*   80+M-82+M	##
      //=> 0D 0A 			*   82+M-86+M	Serial Number
      //=> 0D 0A 			*   86+M-90+M	Error Check
      //=> 0D 0A 			*   90+M-94+M	Stop Bit
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
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit
      //=> 17					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command => M
      //=> 0D 0A 				10-18	Server Flag Bit
      //=> 0D 0A 				18-32	ADDRESS
      //=> 0D 0A 				32-36	&&
      //=> 0D 0A 			*   36  -36+M	Address Content
      //=> 0D 0A 			*   36+M-38+M	&&
      //=> 0D 0A 			*   38+M-80+M	Phone Number
      //=> 0D 0A 			*   80+M-82+M	##
      //=> 0D 0A 			*   82+M-86+M	Serial Number
      //=> 0D 0A 			*   86+M-90+M	Error Check
      //=> 0D 0A 			*   90+M-94+M	Stop Bit
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
      //78782E2A0F0C1D071139CA027AC8000C4658000014D8313235323031333533
      //3231373730373900000000000001002A6ECE0D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 26					 6- 8 	protocal number
      //=> 0F 0C 1D 03 0B			 8-20	Date Time (UTC)
      //=> 0B					20-22	Quantity of GPS Information Satellites
      //=> 26 C9 02 7A  			22-30	Latitude
      //=> C8 18 0C 46	         		30-38	Longitude
      //=> 58					38-40 	Speed
      //=> 60 00				40-44 	Course Status
      //					44-86	Phone Number
      //=> 9D 86				86-90	Error Check
      //=> 0D 0A 				90-94	Stop Bit

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
      //{{{ specfic code for Terminal Address Request Packet
      //787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
      //=> 78 78 				 0- 4	start code
      //=> 22					 4- 6	packet length
      //=> 22					 6- 8 	protocal number
      //=> 00 01				 8-12	MCC
      //=> 02					12-14	MNC
      //=> 02					14-18	LAC
      //=> 02					18-24	CELL ID
      //=> 02					24-66	Phone Number
      //=> 00 0F				66-70	Alarm Language
      //=> 00 0F				70-74	Serial Number
      //=> DC EE				74-78	Error Check
      //=> 0D 0A 				78-82	Stop Bit
      else if(ProtocalNumber == "22"){
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
      //{{{ specfic code for chinese Responce of Server address Request packet
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit
      //=> 17					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command => M
      //=> 0D 0A 				10-18	Server Flag Bit
      //=> 0D 0A 				18-32	ADDRESS
      //=> 0D 0A 				32-36	&&
      //=> 0D 0A 			*   36  -36+M	Address Content
      //=> 0D 0A 			*   36+M-38+M	&&
      //=> 0D 0A 			*   38+M-80+M	Phone Number
      //=> 0D 0A 			*   80+M-82+M	##
      //=> 0D 0A 			*   82+M-86+M	Serial Number
      //=> 0D 0A 			*   86+M-90+M	Error Check
      //=> 0D 0A 			*   90+M-94+M	Stop Bit
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
      //{{{ specfic code for 97 english Responce of Server address Request packet ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 8	Length of data bit (1+1+4+7+2+M+2+21+2+2+2)
      //=> 97					 8-10 	protocal number
      //=> 99					10-12	Length of Command => M
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
      if(ProtocalNumber == "97"){
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
      //{{{ specfic code for 80 Online command sent by server ---+
      //78789F179900000001414C41524D534D532626970752A862A58B66003A0047
      //0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
      //7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
      //E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
      //3326260000000000000000000000000000000000000000002323001CEA970D0A
      //=> 78 78 				 0- 4	Start Code
      //=> 05					 4- 6	Length of data bit (1 + 1 + 4 + M + 2 + 2 + 2)
      //=> 80					 6- 8 	protocal number
      //=> 99					 8-10	Length of Command => M
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
      //{{{ specfic code for 21 Online command replied by terminal ---+
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
      //{{{ specfic code for 26 Time Request Sent By Terminal ---+
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 26					 6- 8 	protocal number
      //=> 00 05				 8-12	Information serial number
      //=> 9F F8				12-16	Error Check
      //=> 0D 0A 				16-20	Stop Bit
      if(ProtocalNumber == "26"){
      var PacketLength = str.substring(4,6);
      var InformationSerialNumber = str.substring(8,12);
      var ErrorCheck = str.substring(12,16);
      var StopBit = str.substring(16,20);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 8A Server Responce Time Information ---+
      //7878050100059FF80D0A
      //=> 78 78 				 0- 4	start code
      //=> 05					 4- 6	packet length
      //=> 8A					 6- 8 	protocal number
      //=> 00 05				 8-20	Information Content
      //=> 00 05				20-24	Information Serial Number
      //=> 9F F8				24-28	Error Check
      //=> 0D 0A 				28-32	Stop Bit
      if(ProtocalNumber == "8A"){
      var PacketLength = parseInt( str.substring(4,6));
      var InformationContent = str.substring(8,20);
      var InformationSerialNumber = str.substring(20,24);
      var ErrorCheck = str.substring(24,28);
      var StopBit = str.substring(28,32);
      console.log(" packet data:\n packet sent by server: "+str+"\n Start Bit : "+StartBit+"\n Packet Length : "+PacketLength+"\n Protocol Number : "+ProtocalNumber+"\n InformationContent : "+InformationContent+"\n Information Serial Number : "+InformationSerialNumber+"\n Error Check : "+ErrorCheck+"\n Stop Bit : "+StopBit+"\n");
      }
      //}}}
      //{{{ specfic code for 94 Information Transmission Packet Sent by terminal ---+
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
}).listen(8000);
// port off set }}}
// {{{ the cartel info
console.log("cartel is runnig on the port 8000\n");
// }}}
