import Unmarshaller = require('./src/unmarshal');
import Interpreter = require('./src/interpreter');
import Py_CodeObject = require('./src/codeobject');

console.log("Running unmarshal test...");
var u = new Unmarshaller("examples/play.pyc");
var code: Py_CodeObject = u.value();
console.log(code.toString());

console.log("\nRunning interpreter test:");
var i = new Interpreter();

console.log("Playground:");
i.interpret(code);

console.log("Multiple function arguments code:");
var u = new Unmarshaller("examples/multiargs.pyc");
i.interpret(u.value());

console.log("\nExample: 1code");
var u = new Unmarshaller("examples/1code.pyc");
i.interpret(u.value());

console.log("\nExample: 3code");
var u = new Unmarshaller("examples/3code.pyc");
i.interpret(u.value());

console.log("\nExample: 4code");
var u = new Unmarshaller("examples/4code.pyc");
i.interpret(u.value());

console.log("\nExample: 64-bit math")
var u = new Unmarshaller("examples/int64math.pyc");
i.interpret(u.value());

console.log("\nExample: Complex number math")
var u = new Unmarshaller("examples/complexmath.pyc");
i.interpret(u.value());

console.log("\nExample: Mixed arithmetic: Int64 + Int32");
var u = new Unmarshaller("examples/mixedarim1.pyc");
i.interpret(u.value());

console.log("\nExample: Keyword arguments in functions");
var u = new Unmarshaller("examples/keywordargs.pyc");
i.interpret(u.value());

console.log("\nExample: If statement in function (simple)");
var u = new Unmarshaller("examples/ifabs.pyc");
i.interpret(u.value());
