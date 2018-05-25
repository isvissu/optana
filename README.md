# Hapi frame work 

TCP chat framework 
mock chat with the device sending and reciving the packets

different protocols 
## specfic code for 1.1 
   01 login packet ---+
      78781101075253367890024270003201000512790D0A
     > 78 78 				 0- 4	start code
     > 11 * 4 = 44 	 4- 6	length
     > 01 > 				 6- 8	protocal number
     > 07 52 53 36 78 90 02 42 70 > 	 8-26	imei number
     > 00 32  				26-30	model Identification code
     > 00 32  				26-30	model Identification code
     > 01 00  				30-34	time zone and language
     > 05 12 				34-38 	this is the information serial number
     > 12 79 				38-42	error check
     > 0D 0A 				42-46	Stop Bit
## specfic code for 1.2 
   01 login packet Response ---+
      7878050100059FF80D0A
      > 78 78 				 0- 4	start code
      > 05					 4- 6	packet length
      > 01					 6- 8 	protocal number
      > 00 05				 8-12	Information serial number
      > 9F F8				12-16	Error Check
      > 0D 0A 				16-20	Stop Bit
## specfic code for 2.1 
   13 heart beat packet ---+
      78780A134004040001000FDCEE0D0A
      > 78 78 				 0- 4	start code
      > 0A					 4- 6	packet length
      > 13					 6- 8 	protocal number
      > 40					 8-10	Terminal Information Content
      > 04					10-12	Voltage Level
      > 04 				12-14	GSM Signal Strength
      > 00 01				14-18	Language / Extended Port Status
      > 00 0F				18-22	Serial Number
      > DC EE				22-26	Error Check
      > 0D 0A 				26-30	Stop Bit
 ## specfic code for 2.2 
   13 Server Response Heart Beat Packet ---+
      7878050100059FF80D0A
      > 78 78 				 0- 4	start code
      > 05					 4- 6	packet length
      > 01					 6- 8 	protocal number
      > 00 05				 8-12	Information serial number
      > 9F F8				12-16	Error Check
      > 0D 0A 				16-20	Stop Bit
  ## specfic code for 3.1 
   22 Location packet ---+
      787822220F0C1D023305C9027AC8180C46586000140001CC00287D001F71000001000820860D0A
      > 78 78 				 0- 4	start code
      > 22					 4- 6	packet length
      > 22					 6- 8 	protocal number
      > 0F 0C 1D 02 33 05			 8-20	Date Time
      > 0F 0C 1D 02 33 05			20-22	Quantity of GPS Signal
      > C9	02 7A C8 			22-30	Latitude
      > 18 0C 46 58	         		30-38	Longitude
      > 60					38-40	Speed
      > 00 14				40-44	Course Status
      > 00 01				44-48	MCC
      > 02					48-50	MNC
      > 02					50-54	LAC
      > 02					54-60	CELL ID
      > 02					60-62	ACC
      > 02					62-64	Data Upload Mode
      > 02					64-66	GPS Real-Time Re-upload
      > 02					66-74	Mileage
      > 00 0F				74-78	Serial Number
      > DC EE				78-82	Error Check
      > 0D 0A 				82-86	Stop Bit
      
      



















