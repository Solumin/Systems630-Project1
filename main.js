var Unmarshaller = require('./src/unmarshal');
var Interpreter = require('./src/interpreter');
// var BrowserFS = require('./lib/browserfs');

// Get the contents of the .pyc file
function readFile(readerEvent) {
    console.log("PYC: ", readerEvent.target.result);
    console.log("Length: ", readerEvent.target.result.byteLength);
    var buffer = new Uint8Array(readerEvent.target.result);
    var pycdata = new Buffer(buffer);
    // var pycdata = new Buffer(readerEvent.target.result);
    console.log("DATA:", pycdata);
    console.log("Length:", pycdata.length);
    interpData(pycdata);
}

// Once user has selected file, load it to be read
function loadFile() {
    var pycfile = document.getElementById('pycfile').files[0];
    if (typeof pycfile === "undefined") {
        console.log("NO FILE UPLOADED");
        return;
    }
    console.log("PYC File:", pycfile);
    var reader = new FileReader();
    reader.onerror = (function (error) { console.log(error);});
    reader.onload = readFile;
    reader.readAsArrayBuffer(pycfile);
}

// Once file has been loaded and read, interpret it
function interpData(data) {
    console.log("In interpData");
    if (data.length == 0) {
        console.log("No data!");
        return;
    }

    var outputDevice = {}
    var outputField = document.getElementById("output");
    outputDevice['write'] = function(str) {
        outputField.value += str;
    };

    var interp = new Interpreter(outputDevice);
    var unmar = new Unmarshaller(data);
    var value = unmar.value();
    console.log(interp.interpret(value));
}

BrowserFS.install(window);
document.getElementById("processFile").onclick = loadFile;
