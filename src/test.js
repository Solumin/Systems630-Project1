// <reference path="unmarshal.ts" />
// <reference path="interpreter.ts" />
// <reference path="frameobject.ts" />
var unmarshal = require('./unmarshal');
var interpreter = require('./interpreter');
console.log("Running unmarshal test...");
var u = new unmarshal.Unmarshaller("../examples/simpleadd.pyc");
var code = u.value();
console.log(code);
console.log("\nRunning interpreter test:");
var i = new interpreter.Interpreter();
console.log(i.interpret(code));
