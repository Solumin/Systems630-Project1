/// <reference path="interpreter.ts" />
/// <reference path="unmarshal.ts" />
/// <reference path="frameobject.ts" />

var u = new Unmarshaller("../examples/simpleadd.pyc");
var code: Py_CodeObject = u.value();
console.log(code);
code.consts.forEach(function(element, index, array) {
    console.log("\t" + index + ": " + element);
});
