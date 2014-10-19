import unmarshal = require('./src/unmarshal');
import interpreter = require('./src/interpreter');
import codeObj = require('./src/codeobject');

console.log("Running unmarshal test...");
var u = new unmarshal.Unmarshaller("examples/play.pyc");
var code: codeObj.Py_CodeObject = u.value();
console.log(code.toString());

console.log("\nRunning interpreter test:");
var i = new interpreter.Interpreter();

console.log("Playground:");
i.interpret(code);

console.log("Multiple function arguments code:");
var u = new unmarshal.Unmarshaller("examples/multiargs.pyc");
i.interpret(u.value());

console.log("\nExample: 1code");
var u = new unmarshal.Unmarshaller("examples/1code.pyc");
i.interpret(u.value());

console.log("\nExample: 3code");
var u = new unmarshal.Unmarshaller("examples/3code.pyc");
i.interpret(u.value());

console.log("\nExample: 4code");
var u = new unmarshal.Unmarshaller("examples/4code.pyc");
i.interpret(u.value());

console.log("\nExample: 64-bit math")
var u = new unmarshal.Unmarshaller("examples/int64math.pyc");
i.interpret(u.value());

console.log("\nExample: Complex number math")
var u = new unmarshal.Unmarshaller("examples/complexmath.pyc");
i.interpret(u.value());

console.log("\nExample: Mixed arithmetic: Int64 + Int32");
var u = new unmarshal.Unmarshaller("examples/mixedarim1.pyc");
i.interpret(u.value());

console.log("\nExample: Keyword arguments in functions");
var u = new unmarshal.Unmarshaller("examples/keywordargs.pyc");
i.interpret(u.value());

console.log("\nExample: If statement in function (simple)");
var u = new unmarshal.Unmarshaller("examples/ifabs.pyc");
i.interpret(u.value());
