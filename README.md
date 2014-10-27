Systems630-Project1
===================

## Dependencies
- TypeScript
- Browserify (`npm install browserify`)
- NodeJS for testing
- Python 2.7.8 for compiling tests
    - `python2.7` should be in $PATH

**Tested on:** Google Chrome 38.0.2125.104 (64-bit)

## Features
Supports a subset of Python 2.7.8 bytecode:
- Functions (including keyword and default arguments)
- Condition statements (`if` and comparisons of integers and booleans)
- The four numeric types: Integer (32 and 64 bit), Long (arbitrary precision),
  Float and Complex.
    - Certain operations are unsupported, e.g. powers for complex numbers
- Output via printing
    - Spaces are not automatically inserted between elements

# Usage

## Running Main Interpreter
- Compile the main JavaScript driver:
```
$ make main
```
- Load `main.html` in your browser of choice
- Click on "Choose File" and upload a .pyc file
- Click "Process File". The output should appear in the Output area.

## Running Tests
- Compile the test.js file and the Python tests with Make
- Run the test.js file in node
```
$ make test
$ node test.js
```

### Adding More Tests
- Write the test: `testExample.py`
- Save it somewhere in the examples/ directory
- Add a new test to test.ts that gives a description for the test and a path to
  the .pyc file:
```javascript
test("This is a sample test", "examples/path/to/testExample.pyc");
```
- Make should be able to automatically compile the test file

Repository for Project 1 of the CS630 Systems course

- example\_pyc/ contains several sample Python files, their compiled versions,
  and annotations on those compiled files.
- pyc\_notes/ contains information gained while dissecting .pyc files
- typescript/ contains a start at the .pyc unmarshaller.
