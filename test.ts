import fs = require('fs');
import Unmarshaller = require('./src/unmarshal');
import Interpreter = require('./src/interpreter');
import Py_CodeObject = require('./src/codeobject');

var interp = new Interpreter();
function test(name, file) {
    console.log("Running " + name);
    var u = new Unmarshaller(fs.readFileSync(file));
    // The test does all the pass/fail checking
    interp.interpret(u.value());
    console.log();
}

test("Integer test", "examples/math/intTest.pyc");
test("Long Int test", "examples/math/longTest.pyc");
test("Floating-point test", "examples/math/floatTest.pyc");
test("Complex number test", "examples/math/complexTest.pyc");
test("Mixed Arithmetic test", "examples/math/mixedMathTest.pyc");
test("Keyword and default arguments test","examples/functions/keywordargs.pyc");
test("Numeric comparison test", "examples/functions/comparisonTest.pyc");

// console.log("Running unmarshal test...");
// var u = new Unmarshaller("examples/play.pyc");
// var code: Py_CodeObject = u.value();
// console.log(code.toString());

// console.log("\nRunning interpreter test:");
// var i = new Interpreter();

// console.log("Playground:");
// i.interpret(code);

// console.log("Multiple function arguments code:");
// var u = new Unmarshaller("examples/multiargs.pyc");
// i.interpret(u.value());

// console.log("\nExample: 1code");
// var u = new Unmarshaller("examples/1code.pyc");
// i.interpret(u.value());

// console.log("\nExample: 3code");
// var u = new Unmarshaller("examples/3code.pyc");
// i.interpret(u.value());

// console.log("\nExample: 4code");
// var u = new Unmarshaller("examples/4code.pyc");
// i.interpret(u.value());

// console.log("\nExample: 64-bit math")
// var u = new Unmarshaller("examples/int64math.pyc");
// i.interpret(u.value());

// console.log("\nExample: Complex number math")
// var u = new Unmarshaller("examples/complexmath.pyc");
// i.interpret(u.value());

// console.log("\nExample: Mixed arithmetic: Int64 + Int32");
// var u = new Unmarshaller("examples/mixedarim1.pyc");
// i.interpret(u.value());

// console.log("\nExample: Long integer arithmetic");
// var u = new Unmarshaller("examples/longmath.pyc");
// i.interpret(u.value());

// console.log("\nExample: Keyword arguments in functions");
// var u = new Unmarshaller("examples/keywordargs.pyc");
// i.interpret(u.value());

// console.log("\nExample: If statement in function (simple)");
// var u = new Unmarshaller("examples/ifabs.pyc");
// i.interpret(u.value());
