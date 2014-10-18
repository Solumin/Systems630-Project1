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
console.log("Simple addition function:");
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
console.log("Example: 5code");
var u = new unmarshal.Unmarshaller("../examples/5code.pyc");
i.interpret(u.value());
