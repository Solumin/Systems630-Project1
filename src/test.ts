// <reference path="unmarshal.ts" />
// <reference path="interpreter.ts" />
// <reference path="frameobject.ts" />
import unmarshal = require('./unmarshal');
import interpreter = require('./interpreter');
import codeObj = require('./codeobject');

console.log("Running unmarshal test...");
var u = new unmarshal.Unmarshaller("../examples/simpleadd.pyc");
var code: codeObj.Py_CodeObject = u.value();
console.log(code);

console.log("\nRunning interpreter test:");
var i = new interpreter.Interpreter();
console.log(i.interpret(code));
