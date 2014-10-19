// <reference path="unmarshal.ts" />
// <reference path="interpreter.ts" />
// <reference path="frameobject.ts" />
import unmarshal = require('./unmarshal');
import interpreter = require('./interpreter');
import codeObj = require('./codeobject');

console.log("Running unmarshal test...");
var u = new unmarshal.Unmarshaller("../examples/play.pyc");
var code: codeObj.Py_CodeObject = u.value();
console.log(code);

console.log("\nRunning interpreter test:");
var i = new interpreter.Interpreter();

console.log("Playground:");
i.interpret(code);

console.log("Multiple function arguments code:");
var u = new unmarshal.Unmarshaller("../examples/multiargs.pyc");
i.interpret(u.value());

console.log("Example: 1code");
var u = new unmarshal.Unmarshaller("../examples/1code.pyc");
i.interpret(u.value());

console.log("Example: 3code");
var u = new unmarshal.Unmarshaller("../examples/3code.pyc");
i.interpret(u.value());

console.log("Example: 4code");
var u = new unmarshal.Unmarshaller("../examples/4code.pyc");
i.interpret(u.value());
