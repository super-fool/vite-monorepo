"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var common_1 = require("./common");
process.on("unhandledRejection", function (err) {
    throw err;
});
var cwd = process.cwd();
var initializeFun = function () {
    var npmCmd = "npm install";
    var lernaCmds = [
        "lerna clean --yes",
        "lerna exec -- rm -rf dist",
        "lerna bootstrap",
    ];
    child_process_1.exec([npmCmd, lernaCmds.join(" && ")].join("&&"), {
        cwd: cwd
    }, function (err) {
        if (err)
            console.log(err);
    });
};
common_1.checkNodeVersion(initializeFun);
