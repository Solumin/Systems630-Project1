var fs = require('fs')
var some_code = undefined
var magicNumber = []
var magicNumberHex = []
var timeStamp = []
var infoMain = []
var mainCode = []

function readCodeFile(callback) {
  fs.readFile('examples_pyc/4code.pyc', function doneReading(err, fileContents) {
    some_code = fileContents
    //myNumber++
    callback()
  })
}

function readCode() {
	// counting the bytes starting from byte 0
	var codeCounter = 0
	console.log('Size of file:'+some_code.length)
	console.log(some_code)
	/*for (i=0; i<some_code.length; i++){
		console.log(some_code[i])		
	}*/
	// Read the header
	for (i=0; i<4; i++){
		magicNumber[i] = some_code[i].toString(16)
		timeStamp[i] = some_code[i+4].toString(16)
		//magicNumberHex[i] = some_code[i].toString(16);
	}
	codeCounter = 8; //read 8 bytes

	console.log(magicNumber)
	console.log(timeStamp)
	
	// Read the information abot the main code
	for (i=0; i<22; i++){
		infoMain[i] = some_code[i+codeCounter].toString(16)
		//infoMain[i] = some_code[i+8];
	}
	console.log(infoMain)
	codeCounter += 22; //read more 22 bytes
	console.log('Code counter:'+codeCounter)
	
	
	// Read the last 4 bytes from infoMain
	var aux = infoMain.slice(18)
	console.log(aux.reverse())
	var sizeCode = aux[0]+aux[1]+aux[2]+aux[3]
	sizeCode = parseInt(sizeCode, 16)
	console.log('bytes main:'+sizeCode)

	for (i=0; i<sizeCode; i++) {
		mainCode[i] = some_code[i+codeCounter].toString(16)
	}
	console.log(mainCode)
	
	codeCounter += sizeCode
	console.log('Code counter:'+codeCounter)



}


readCodeFile(readCode)
