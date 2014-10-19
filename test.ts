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

console.log("Example: 1code");
var u = new unmarshal.Unmarshaller("examples/1code.pyc");
i.interpret(u.value());

console.log("Example: 3code");
var u = new unmarshal.Unmarshaller("examples/3code.pyc");
i.interpret(u.value());

console.log("Example: 4code");
var u = new unmarshal.Unmarshaller("examples/4code.pyc");
i.interpret(u.value());

console.log("Example: 64-bit math")
var u = new unmarshal.Unmarshaller("examples/int64math.pyc");
i.interpret(u.value());

console.log("Example: Complex number math")
var u = new unmarshal.Unmarshaller("examples/complexmath.pyc");
i.interpret(u.value());

console.log("Example: Mixed arithmetic: Int64 + Int32");
var u = new unmarshal.Unmarshaller("examples/mixedarim1.pyc");
i.interpret(u.value());
