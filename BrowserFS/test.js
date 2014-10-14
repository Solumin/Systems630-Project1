// You can pass in an arbitrary object if you do not wish to pollute
// the global namespace.
BrowserFS.install(window);

// Constructs an instance of the LocalStorage-backed file system.
var lsfs = new BrowserFS.FileSystem.LocalStorage();

// Initialize it as the root file system.
BrowserFS.initialize(lsfs);

var fs = require('fs');
fs.writeFile('/test.txt', 'Okay, it seems to be working.', function (err) {
    fs.readFile('/test.txt', function (err, contents) {
        console.log(contents.toString());
    });
});
