Systems630-Project1
===================

## Dependencies
- TypeScript
- Browserify (`npm install browserify`)
- NodeJS for testing
- Python 2.7.8 for compiling tests
    - `python2.7` should be in $PATH

## Testing
- Compile the test.js file and the Python tests with Make
- Run the test.js file in node
```
$ make test
$ node test.js
```

Repository for Project 1 of the CS630 Systems course

- example\_pyc/ contains several sample Python files, their compiled versions,
  and annotations on those compiled files.
- pyc\_notes/ contains information gained while dissecting .pyc files
- typescript/ contains a start at the .pyc unmarshaller.
