'use strict';
//{{{ structure of the protocols and project
//                      ________________________________________________________________
//                     |                                                                |
//                     |                             ~T  ~                              |
//                     |                             ~R  ~                              |
//                     | server end                  ~A  ~                              |
//        ...........\ ||-| ___\    -----            ~N U~______________________________|__________\
//        .          / ||-|    /    |----|  _____\   ~S N~                              |          / Display
//        .            |  A          -----       /   ~A I~                              |
//    ___..            |  |          \----\          ~L T~                              |
//   /   /             |  |         data storage     ~A  ~        #########             |
//  /   /              |  |              A           ~T  ~        #command#             |
// /   /               |  |              |           ~I  ~        ##input## /___________|______________
// TTTT                |  |______________|__________ ~O  ~/_______##unit### \           |
// device              |   A             |           ~N  ~\       #########             |
//  A                  |___|_____________|______________________________________________|
//  |                      |             |
//  |                      |             |_______________________________
//  |                      |                                             |
//  |                     This is the device which                       V
//  |                     is server end which handles             this is the data archive
//  |                     two types of requests                   here we store the data revelant
// This is the device        1) from the device                   for
// Developed by concox           i) to login to send the GPS
// we have to develop               Alarms , and to execute
// communication layer              certain funtionalaties
// to this device                   on the device
//                           2) from the website or any other
//                              front-end client application
//                              web for now can expand in
//                              future
//}}}
//{{{ progress of the project
//                      ________________________________________________________________
//                     |                                                                |
//                     |                             ~T  ~                              |   ______________________ we have developed the
//                     |                             ~R  ~                              |  |                       technologies to give
//                     | server end                  ~A  ~                              |  |                       visual out put
//        ...........\ ||-| ___\    -----            ~N U~______________________________|__V_______\
//        .          / ||-|    /    |----|  _____\   ~S N~                              |          / Display
//        .            |  A          -----       /   ~A I~                              |
//    ___..            |  |          \----\          ~L T~                              |    _____________________________ The server request handler is setup and will
//   /   /             |  |         data storage     ~A  ~        #########             |   |                              send appropriate commands to destinations desired
//  /   /              |  |            A             ~T  ~        #command#             |   |
// /   /               |  |            |             ~I  ~        ##input## /___________|___V___________
// TTTT                |  |____________|____________ ~O  ~/_______##unit### \           |
// device              |    A          |             ~N  ~\       #########             |
//  A                  |____|__________|_______________A________________________________|
//  |                       |          |               |_________
//  |                       |          |                         |
//  |_communication         |          |  The datashema dezine   |  The total protocals of the
//    established     Server is setup  |_ is under construction  |  server established and the
//    from the        the technologies    once done we can deploy|_ transilation from the code
//    device          are not setup                                 to english or chinies is
//                                                                  done
//                                                                  i.e we are capable to
//                                                                  understand the code
//                                                                  and create the code
//                                                                  for the communication
//}}}
//{{{ Delcare internals
const internals = {};
// This is an example of a survey to obtain the reputation of Parisians
// It contains examples of how to conditionally require keys based on values of other keys
//}}}
//{{{ constraints definitation
// This is a valid value for integer rating 1 - 5
const intRating = Joi.number().integer().min(1).max(5);
var format = require('biguint-format');
var bitwise = require('bitwise');
//}}}
//{{{ variables of the enigma
var
AlarmB1,
AlarmB2,
AlarmB3,
StatusBit1,
SOSno,
CenterNo,
Fence,
FuelElecticityCutoffStatus,
Mode,
ALM1b0, 			// Alarm Bit1 bite 1
ALM1b1,				// ||
ALM1b2,				// ||
ALM1b3,				// ||
ALM1b4,				// ||
ALM1b5,				// ||
ALM1b6,				// ||
ALM1b7,				// Alarm Bit1 bite 8
ALM2b0,				// Alarm Bit2 bite 1
ALM2b1,				// ||
ALM2b2,				// ||
ALM2b3,				// ||
ALM2b4,				// ||
ALM2b5,				// ||
ALM2b6,				// ||
ALM2b7,				// Alarm Bit2 bite 8
ALM3b0,				// Alarm Bit3 bite 1
ALM3b1,				// ||
ALM3b2,				// ||
ALM3b3,				// ||
ALM3b4,				// ||
ALM3b5,				// ||
ALM3b6,				// ||
ALM3b7,				// Alarm Bit3 bite 8
STA1b0,				// Status Bit1 bite 1
STA1b1,				// ||
STA1b2,				// ||
STA1b3,				// ||
STA1b4,				// ||
STA1b5,				// ||
STA1b6,				// ||
STA1b7,				// Status Bit1 bite 8
FESDb0,				// Fuel/Electricity Status bite 1
FESDb1,				// ||
FESDb2,				// ||
FESDb3,				// ||
FESDb4,				// ||
FESDb5,				// ||
FESDb6,				// ||
FESDb7,				// Fuel/Electricity Status bite 8
IODEb0,				// External IO detection (door checking). bite 1
IODEb1,				// ||
IODEb2,				// ||
IODEb3,				// ||
IODEb4,				// ||
IODEb5,				// ||
IODEb6,				// ||
IODEb7,				// External IO dectection (door checking) bite 8
PacLen,				// the packet length
ProcNo,				// the protocal Number
TermID,				// the teminal ID
MICCod,				// Model Identification number
TimZoL,				// Time Zone Language
INSeNo,				// Information Serial Number
ErrorC,				// Error Check
CRAlen,				//10 chainese responce has variable length solved by putting the variable length
ERAlen,				//11 english responce has variable length solved by var length
CRGlen,				//13 chainese responce has variable length solved by var length
ERGlen,				//14 english responce has variable length solved by var length
CRCDic =[
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
],
//}}}
//{{{ constants of the enigma
const
// this is the codes of the protocals of that are given for the device
LoginI = 0x01, 			//  1 login information
PosDat = 0x22, 			//  2 position data (UTC)
Heartb = 0x13, 			//  3 Heartbeat Packet
OCRTeb = 0x21, 			//  4 Online command Response of Terminal
Alarm1 = 0x26, 			//  5 Alarm Data single fence
Alarm2 = 0x27, 			//  6 Alarm Data multiple fence
GPSIPt = 0x2A, 			//  7 GPS Address Inquiry Packet (UTC)
LBSAIP = 0x17, 			//  8 LBS Address Inquire Packet
OnlinC = 0x80, 			//  9 Online command
TimeCP = 0x8A, 			// 10 Time Check Packet
InfoTP = 0x94, 			// 11 Information Transmission Packet
LBSmbe = 0x28, 			// 12 Time Check Packet
EROSAP = 0x97, 			// 13 The English Responce of Server Address Alarm Packet
DevNam = 3677, 			// This is the device name
IMEIbb = 351608083563440,	// the imei number padded with null bb
Modelb = 'GT800',  		// the model name of the device
SIMdat = 9711522170,   		// the phone no of the device
Startb = 0x7878,		// the value with which a packet starts
Stopbb = 0x0D0A,		// the value with which a packet stops
IMEIar = [0x35,0x16,0x08,0x08,0x35,0x63,0x44,0x00], // hex array of the imei
LMPlen = 0x11,			// 1 Login Message Packet length
LPRlen = 0x05,			// 2 Login Packet Responce (server response)
HPSlen = 0x0A,			// 3 Heartbeat packet sent by terminal
SRHlen = 0x05,			// 4 Server responds the heartbeat packet
LPSlen = 0x22,			// 5 Location packet sent by terminal
LBSlen = 0x3B,			// 6 LBS Multiple Bases Extension packet
Al1len = 0x25,			// 7 Alarm packet sent by terminal under one fence
Al2len = 0x26,			// 8 Alarm packet sent by terminal under mutiple fence
APRlen = 0x05,			// 9 Alarm packet response of server
				//10 chainese responce has variable length think to solve this
				//11 english responce has variable length think to solve this
GPSlen = 0x2E, 			//12 Terminal Address Request Packet
				//13 chainese responce has variable length think to solve this
				//14 english responce has variable length think to solve this
//this are the constaints of the alarm language
Normal				= 0x00,
SOS				= 0x01,
PowerCutAlarm			= 0x02,
VibrationAlarm 			= 0x03,
EnterFenceAlarm			= 0x04,
ExitFenceAlarm			= 0x05,
OverSpeedAlarm			= 0x06,
VibrationAlarm			= 0x09,
EnterGPSDeadzoneAlarm		= 0x0A,
ExitGPSDeadzoneAlarm		= 0x0B,
PowerOnAlarm			= 0x0C,
GPSFirstFixNotice		= 0x0D,
LowBatteryAlarm			= 0x0E,
LowBatteryProtectionAlarm	= 0x0F,
SIMChangeNotice			= 0x10,
PowerLow-offAlarm		= 0x11,
AirplaneModeAlarm		= 0x12,
DisassembleAlarm		= 0x13,
DoorAlarm			= 0x14,
ShutdownAlarm			= 0x15,
// this is to select alarm
Chinese 			= 0x01,
English				= 0x02,
NoNeedForReply			= 0x00,
//}}}
//{{{
function createloginpacket( imei ){
return '78 78 11'+imei+'02 42 01  79 0D 0A'
}
//}}}
//{{{ the function to check the protocol ie identification of the protocal
function checkprotocal(protocalno,protocallength){
var protocal = -1;
	      if(protocalno == LoginI && protocallength == LMPlen){
		protocal = 1;
	}else if(protocalno == LoginI && protocallength == LPRlen){
		protocal = 2;
	}else if(protocalno == Heartb && protocallength == HPSlen){
		protocal = 3;
	}else if(protocalno == Heartb && protocallength == SRHlen){
		protocal = 4;
	}else if(protocalno == PosDat && protocallength == LPSlen){
		protocal = 5;
	}else if(protocalno == PosDat && protocallength == LPRlen){
		protocal = 6;
	}else if(protocalno == LBSmbe && protocallength == LBSlen){
		protocal = 7;
	}else if(protocalno == Alarm1 && protocallength == Al1len){
		protocal = 8;
	}else if(protocalno == Alarm2 && protocallength == Al2len){
		protocal = 9;
	}else if(protocalno == Alarm1 && protocallength == APRlen){
		protocal = 10;
	}else if(protocalno == GPSIPt && protocallength == GPSlen){
		protocal = 12;
	}else{
	            if(protocalno = LBSAIP){
			    //here you get two responces
		      protocal = 0;
	      }else if(protocalno = EROSAP){
		      	    //here you ger two responces
		      protocal = 0;
	      }else {
		      protocal = -2;
	      }
	}
return protocal;
}
//}}}
//{{{ function to extract the protocol number out of code of the enigma
function getprotocalno(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(6, 8);
}
//}}}
//{{{ function to extract the protocol length out of code of the enigma
function getprotocallen(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(4, 6);
}
//}}}
//{{{ function of Loging message packet
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

function getimeiLMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 26);
}

function getmodelLMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(26, 30);
}

function gettimezoneLLMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(30, 34);
}

function getInformationSerialNoLMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(34, 36);
}

function getErrorCheckLMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(36, 40);
}
//}}}
//{{{ functions of Login Packet Responce
//7878050100059FF80D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	packet length
//=> 01					 6- 8 	protocal number
//=> 00 05				 8-12	Information serial number
//=> 9F F8				12-16	Error Check
//=> 0D 0A 				16-20	Stop Bit


function getInformationSerialNumberLPR(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 12);
}

function getErrorCheckLPR(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 16);
}
//}}}
//{{{ functions of Heart Beat Packet
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


function getTerminalInformationContentHBP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 16);
}

function getVoltageLevelHBP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10, 12);
}

function getGSMSignalStrengthHBP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 14);
}

function getLanguageExtendedPortStatusHBP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(14, 18);
}

function getSerialNumberHBP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18, 22);
}

function getErrorCheckHBP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(22, 26);
}
//}}}
//{{{ functions of Server Responce Heart Beat Packet
//787805230100670E0D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	packet length
//=> 23					 6- 8 	protocal number
//=> 01 00				 8-12	Serial Number
//=> 67 0E				12-16	Error Check
//=> 0D 0A 				16-20	Stop Bit

function getSerialNumberSRH(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 12);
}

function getErrorCheckSRH(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 16);
}
//}}}
//{{{ functions of Location Packet
//787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
//=> 78 78 				 0- 4	start code
//=> 22					 4- 6	packet length
//=> 22					 6- 8 	protocal number
//=> 0F 0C 1D 02 33 05			 8-20	Date Time
//=> 0F 0C 1D 02 33 05			20-22	Quantity of GPS Signal
//=> C9	02 7A C8 			22-30	Latitude
//=> 18 0C 46 58			30-38	Longitude
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


function getDateTimeLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 20);
}

function getQuantityGPSSatellitesLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(20, 22);
}

function getLatitudeLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(22, 30);
}

function getLogitudeLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(30, 38);
}

function getSpeedLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38, 42);
}

function getCourseStatusLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(42, 44);
}

function getMCCLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(44, 48);
}

function getMNCLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(48, 50);
}

function getLACLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(50, 54);
}

function getCELLIDLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(54, 60);
}

function getACCLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(60, 62);
}

function getDataUploadModeLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(62, 64);
}

function getGPSRealTimeReUploadLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(64, 68);
}

function getMileageLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(68, 76);
}

function getSerialNumberLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(76, 82);
}

function getErrorCheckLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(82, 86);
}
//}}}
//{{{ functions LBS Multiple Base Extension Packet
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



function getDateTimeLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 20);
}

function getMCCLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(20, 24);
}

function getMNCLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(24, 26);
}

function getLACLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(26, 30);
}

function getCILBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(30, 36);
}

function getRSSILBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(36, 38);
}

function getNLAC1LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38, 42);
}

function getNCI1LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(42, 48);
}

function getNRSSI1LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(48, 50);
}

function getNLAC2LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(50, 54);
}

function getNCI2LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(54, 60);
}

function getNRSSI2LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(60, 62);
}

function getNLAC3LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(62, 64);
}

function getNCI3LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(64, 70);
}

function getNRSSI3LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(70, 72);
}

function getNLAC4LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(72, 74);
}

function getNCI4LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(74, 80);
}

function getNRSSI4LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(80, 82);
}

function getNLAC5LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(82, 84);
}

function getNCI5LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(84, 90);
}

function getNSSI5LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(90, 92);
}

function getNLAC6LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(92, 94);
}

function getNCI6LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(94, 100);
}

function getNRSSI6LBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(100, 102);
}

function getTimingAdvanceLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(102, 104);
}

function getLanguageLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(104, 108);
}

function getSerialNumberLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(108, 112);
}

function getErrorCheckLBSMP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(112, 116);
}
//}}}
//{{{ Alram Packet Sent by Terminal One Fence
//787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
//=> 78 78 				 0- 4	start code
//=> 25					 4- 6	packet length
//=> 26					 6- 8 	protocal number
//=> 0F 0C 1D 03 0B			 8-20	Date Time (UTC)
//=> 0B					20-22	Quantity of GPS Information Satellites
//=> 26 C9 02 7A 			22-30	Latitude
//=> C8 18 0C 46			30-38	Longitude
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


function getDateTimeAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 20);
}

function getQuantityGPSSatellitesAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(20, 22);
}

function getLatitudeAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(22, 30);
}

function getLogitudeAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(30, 38);
}

function getSpeedAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38, 40);
}

function getCourseStatusAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(40, 44);
}

function getLBSLengthAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(44, 46);
}

function getMCCAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(46, 50);
}

function getMNCAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(50, 52);
}

function getLACAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(52, 56);
}

function getCELLIDAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(56, 62);
}

function getTerminalInformationIDAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(62, 64);
}

function getVoltageLevelAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(64, 66);
}

function getGSMSignalStrengthAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(66, 68);
}

function getAlarmLanguageAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(68, 72);
}

function getSerialNumberAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(72, 76);
}

function getErrorCheckAPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(76, 80);
}
//}}}
//{{{ Alram Packet Sent by Terminal many Fence
//787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
// functions LBS Multiple Base Extension Packet
//=> 78 78 				 0- 4	start code
//=> 26					 4- 6	packet length
//=> 27					 6- 8 	protocal number
//=> 0F 0C 1D 03 0B			 8-20	Date Time (UTC)
//=> 0B					20-22	Quantity of GPS Information Satellites
//=> 26 C9 02 7A 			22-30	Latitude
//=> C8 18 0C 46			30-38	Longitude
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


function getDateTimeAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 20);
}

function getQuantityGPSSatellitesAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(20, 22);
}

function getLatitudeAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(22, 30);
}

function getLogitudeAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(30, 38);
}

function getSpeedAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38, 40);
}

function getCourseStatusAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(40, 44);
}

function getLBSLengthAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(44, 46);
}

function getMCCAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(46, 50);
}

function getMNCAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(50, 52);
}

function getLACAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(52, 56);
}

function getCELLIDAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(56, 62);
}

function getTerminalInformationIDAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(62, 64);
}

function getVoltageLevelAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(64, 66);
}

function getGSMSignalStrengthAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(66, 68);
}

function getAlarmLanguageAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(68, 72);
}

function getFenceNoAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(72, 74);
}

function getSerialNumberAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(74, 78);
}

function getErrorCheckAPSM(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(78, 82);
}
//}}}
//{{{ functions of Alarm Packet Responce of Server
//78780526001C9D860D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	packet length
//=> 26					 6- 8 	protocal number
//=> 00 1C				 8-12	Serial Number
//=> 9D 86				12-16	Error Check
//=> 0D 0A 				16-20	Stop Bit

function getSerialNumberAPR(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 12);
}

function getErrorCheckAPR(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 16);
}
//}}}
//{{{ functions of Chinese Responce of Server address alarm packet
//78789F179900000001414C41524D534D532626970752A862A58B66003A0047
//0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
//7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
//E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
//3326260000000000000000000000000000000000000000002323001CEA970D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	packet length
//=> 17					 6- 8 	protocal number
//=> 99					 8-10	Length of Command => M
//=> 0D 0A 				10-18	Server Flag Bit
//=> 0D 0A 				18-32	ADDRESS
//=> 0D 0A 				32-36	&&
//=> 0D 0A 			*   36  -36+M	Address Content
//=> 0D 0A 			*   36+M-38+M	&&
//=> 0D 0A 			*   38+M-80+M	Phone Number
//=> 0D 0A 			*   80+M-82+M	##
//=> 0D 0A 			*   82+M-86+M	Information Serial Number
//=> 0D 0A 			*   86+M-90+M	Check Bit
//=> 0D 0A 			*   90+M-94+M	Stop Bit

function getLengthofCommandCRPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 10);
}

function getServerFlagBitCRPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10, 18);
}

function getADDRESSCRPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18, 32);
}

function getlengthofcommand(code){
var length = code.tostring(16);
	return length;
}

var M = getlengthofcommand(getlengthofcommand(code));

function getAddressContentCRPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(36, 36+M);
}

function getPhoneNumberCRPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38+M, 80+M);
}

function getInformationSerialNumberCRPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(82+M, 86+M);
}

function getCheckBitCRPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(86+M, 90+M);
}
//}}}
//{{{ functions of English Resonse of Server Address Alarm Packet
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

function getLengthofCommandERPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 10);
}

function getServerFlagBitERPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10, 18);
}

function getADDRESSERPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18, 32);
}

function getlengthofcommand(code){
var length = code.tostring(16);
	return length;
}

var M = getlengthofcommand(getlengthofcommand(code));

function getAddressContentERPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(36, 36+M);
}

function getPhoneNumberERPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38+M, 80+M);
}

function getInformationSerialNumberERPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(82+M, 86+M);
}

function getCheckBitERPAAP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(86+M, 90+M);
}
//}}}
//{{{ GPS Address Request Packet
//78782E2A0F0C1D071139CA027AC8000C4658000014D8313235323031333533
//3231373730373900000000000001002A6ECE0D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	packet length
//=> 26					 6- 8 	protocal number
//=> 0F 0C 1D 03 0B			 8-20	Date Time (UTC)
//=> 0B					20-22	Quantity of GPS Information Satellites
//=> 26 C9 02 7A 			22-30	Latitude
//=> C8 18 0C 46			30-38	Longitude
//=> 58					38-40 	Speed
//=> 60 00				40-44 	Course Status
//					44-86	Phone Number
//=> 9D 86				86-90	Error Check
//=> 0D 0A 				90-94	Stop Bit


function getDateTimeGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 20);
}

function getQuantityGPSSatellitesGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(20, 22);
}

function getLatitudeGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(22, 30);
}

function getLogitudeGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(30, 38);
}

function getSpeedGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38, 40);
}

function getCourseStatusGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(40, 44);
}

function getPhoneNumberGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(44, 86);
}

function getAlarmLanguageGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(86, 90);
}

function getSerialNumberGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(90, 94);
}

function getErrorCheckGPSARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(94, 98);
}
//}}}
//{{{ functions of Chinese Responce of Server address Request packet
//78789F179900000001414C41524D534D532626970752A862A58B66003A0047
//0054003000360044002D00310032003800330036002D005A004A004D002C5E7F4E1C
//7701002E60E05DDE5E02002E60E057CE533A002E4E915C71897F8DEF002E79BB60
//E05DDE5E025B665927655980B27EA6003200377C73002E002C00310030003A003400
//3326260000000000000000000000000000000000000000002323001CEA970D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	Length of Data bit
//=> 17					 6- 8 	Protocal number
//=> 99					 8-10	Length of Command => M
//=> 0D 0A 				10-18	Server Flag Bit
//=> 0D 0A 				18-32	ADDRESS
//=> 0D 0A 				32-36	&&
//=> 0D 0A 			*   36  -36+M	Address Content
//=> 0D 0A 			*   36+M-38+M	&&
//=> 0D 0A 			*   38+M-80+M	Phone Number
//=> 0D 0A 			*   80+M-82+M	##
//=> 0D 0A 			*   82+M-86+M	Information Serial Number
//=> 0D 0A 			*   86+M-90+M	Check Bit
//=> 0D 0A 			*   90+M-94+M	Stop Bit

function getLengthofDataBitCRPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 10);
}

function getServerFlagBitCRPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10, 18);
}

function getADDRESSCRPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18, 32);
}

function getlengthofcommand(code){
var length = code.tostring(16);
	return length;
}

var M = getlengthofcommand(getlengthofcommand(code));

function getAddressContentCRPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(36, 36+M);
}

function getPhoneNumberCRPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38+M, 80+M);
}

function getInformationSerialNumberCRPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(82+M, 86+M);
}

function getCheckBitCRPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(86+M, 90+M);
}
//}}}
//{{{ functions of English Resonse of Server Address Request Packet
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

function getLengthofDataBitERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 10);
}

function getServerFlagBitERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10, 18);
}

function getADDRESSERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18, 32);
}

function getlengthofcommand(code){
var length = code.tostring(16);
	return length;
}

var M = getlengthofcommand(getlengthofcommand(code));

function getAddressContentERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(36, 36+M);
}

function getPhoneNumberERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(38+M, 80+M);
}

function getInformationSerialNumberERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(82+M, 86+M);
}

function getCheckBitERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(86+M, 90+M);
}
//}}}
//{{{ Terminal Address Request Packet
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


function getMCCTARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 12);
}

function getMNCTARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 14);
}

function getLACTARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(14, 18);
}

function getCELLIDTARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18, 24);
}

function getPhoneNumberTARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(24, 66);
}

function getAlarmLanguageTARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(66, 70);
}

function getSerialNumberLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(70, 74);
}

function getErrorCheckLPS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(74, 78);
}
//}}}
//{{{ function of Online command sent by server
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
//=> 0D 0A 			*   18  -18+M	Command Content
//=> 0D 0A 			*   18+M-22+M	Language
//=> 0D 0A 			*   22+M-26+M	Information Serial Number
//=> 0D 0A 			*   26+M-30+M	Check Bit
//=> 0D 0A 			*   30+M-34+M	Stop Bit

function getLengthofDataBitOCSS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(4, 6);
}

function getProtocolNumberOCSS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(6, 8);
}

function getLengthofCommandOCSS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 10);
}

function getServerFlagBitOCSS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10, 18);
}

function getlengthofcommand(code){
var length = code.tostring(16);
	return length;
}

var M = getlengthofcommand(getLengthofCommandOCSS(code));

function getCommandContentOCSS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18, 18+M);
}

function getLanguageOCSS(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18+M, 22+M);
}

function getInformationSerialNumberERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(22+M, 26+M);
}

function getCheckBitERPARP(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(26+M, 30+M);
}
//}}}
//{{{ functions of Online Command Replied by Terminal
//787805230100670E0D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	Length of Data Bit
//=> 23					 6- 8 	protocal number
//=> 01 00				 8-12	Server Flag Bit
//=> 01 00				12-14	Content Code
//=> 0D 0A 			*   14  -14+M	Content
//=> 01 00			*   14+M-18+M	Information Serial Number
//=> 67 0E			*   18+M-22+M	Check Bit
//=> 0D 0A 			*   22+M-26+M	Stop Bit

function getServerFlagBitOCRT(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 12);
}

function getContentCodeOCRT(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 14);
}

function getlengthofcommandOCRT(code){
var length = code.tostring(16);
	return length;
}
var M = getlengthofcommand(getContentCodeOCRT(code));

function getContentOCRT(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(14, 14+M);
}

function getInformationSerialNumberOCRT(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(14+M, 18+M);
}

function getCheckBitOCRT(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(18+M, 22+M);
}
//}}}
//{{{ functions of Time Request Sent By Terminal
//78780526001C9D860D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	packet length
//=> 26					 6- 8 	protocal number
//=> 00 1C				 8-12	Serial Number
//=> 9D 86				12-16	Error Check
//=> 0D 0A 				16-20	Stop Bit

function getSerialNumberTRST(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 12);
}

function getErrorCheckTST(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(12, 16);
}
//}}}
//{{{ functions of Server Response Time Information
//78780526001C9D860D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	packet length
//=> 26					 6- 8 	protocal number
//=> 26					 8-20 	Date Time
//=> 00 1C				20-24	Serial Number
//=> 9D 86				24-28	Error Check
//=> 0D 0A 				28-32	Stop Bit

function getDateTimeSRTI(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 20);
}

function getSerialNumberSRTI(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(20, 24);
}

function getErrorCheckSTRI(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(24, 32);
}
//}}}
//{{{ functions of Information Transmission Packet Sent By Terminal
//78780526001C9D860D0A
//=> 78 78 				 0- 4	start code
//=> 05					 4- 6	Length of data bit
//=> 26					 6- 8 	protocal number
//=> 00 1C				 8-10	Information Type (Sub-protocol Number)
//=> 00 1C			*   10  -10+N	Data Content
//=> 00 1C			*   10+N-14+N	Information Serial Number
//=> 9D 86			*   14+N-18+N	Check Bit
//=> 0D 0A 			*   18+N-20+N	Stop Bit

function getInformationTypeITPST(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(8, 10);
}

function getlengthofcommandITPST(code){
var length = code.tostring(16);
	return length;
}
var M = getlengthofcommand(getContentCodeITPST(code));
function getDataContentITPST(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10, 10+M);
}

function getInformationSerialNumberITPST(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(10+M, 14+M);
}

function getCheckBitITPST(code){
var hex = "0x"+code;
var str = hex.tostring(16);
	return str.substring(14+M, 16+M);
}
//}}}
//{{{ function to comptute the valuses form the hex code bits
function VolatageOf(code){
var volt = parseInt(code,16);
	return volt;
}

function getTimezoneTZL(code){
var buff =  Buffer.from(code.tostring(16),"hex");
var zone = buff.slice(0,2);
var z = formate(zone,'dec');
var z = formate(zone,'dec')/100;
	return z;
}

function getGMTTZL(code){
var buff = Buffer.from(code.tostring(16),"hex");
var zone = format(buff.slice(3,4),"hex");
var b1 = Math.floor(zone/128*64);
	return b1;
}

function getLanbit1TZL(code){
var buff = Buffer.from(code.tostring(16),"hex");
var zone = format(buff.slice(3,4),"hex");
var b1 = Math.floor((zone%128)/64);
	return b1;
}

function getLanbit2TZL(code){
var buff =  Buffer.from(code.tostring(16),"hex");
var zone = format(buff.slice(3,4),"hex");
var b2 = Math.floor((zone % 128)%64);
	return b2;
}
//}}}
//{{{ function to send and revieve the protocals
function executeprotocal(code,checkprotocal( getprotocalno(code), getprotocallength(code))){

}
//}}}
//{{{ irrelevant stuff
const schema = Joi.object().keys({
    // Do you know any French people? yes or no (required)
    q1: Joi.boolean().required(),
    // Do you know any Parisians? yes or no (required if answered yes in q1)
    q2: Joi.boolean()
        .when('q1', { is: true, then: Joi.required() }),
    // How many french in paris do you know? 1-6, 6-10, 11-50 or 50+ (required if answered yes in q2)
    q3: Joi.string()
        .when('q2', { is: true, then: Joi.valid('1-5', '6-10', '11-50', '50+').required() }),
    // Rate 20% of most friendly Parisians, from how many people you know answered in q3, individually on 1-5 rating
    q4: Joi.array()
        .when('q3', {is: '1-5', then: Joi.array().min(0).max(1).items(intRating).required() })
        .when('q3', {is: '6-10', then: Joi.array().min(1).max(2).items(intRating).required() })
        .when('q3', {is: '11-50', then: Joi.array().min(2).max(10).items(intRating).required() })
        .when('q3', {is: '50+', then: Joi.array().min(10).items(intRating).required() }),
    // Rate remaining 80% of Parisians, from how many people you know answered in q3, individually on 1-5 rating
    q5: Joi.array()
        .when('q3', {is: '1-5', then: Joi.array().min(1).max(4).items(intRating).required() })
        .when('q3', {is: '6-10', then: Joi.array().min(4).max(8).items(intRating).required() })
        .when('q3', {is: '11-50', then: Joi.array().min(8).max(40).items(intRating).required() })
        .when('q3', {is: '50+', then: Joi.array().min(40).items(intRating).required().required() }),
    // Rate the reputation of Parisians in general, 1-5 rating
    q6: intRating.required()
});

const response = {
	q1: true,
	q2: true,
	q3: '1-5',
	q4: [50],
	q5: [1],
	q6: 2
};

Joi.assert(response, schema);
//}}}
