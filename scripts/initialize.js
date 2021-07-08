"use strict";
exports.__esModule = true;
var chalk = require("chalk");
var child_process_1 = require("child_process");
process.on("unhandledRejection", function (err) {
    throw err;
});
var cwd = process.cwd();
var checkNodeVersion = function () {
    child_process_1.exec("node --version", function (err, stdout) {
        var nodeVersion = stdout && parseFloat(stdout.substring(1));
        if (nodeVersion < 7 || err) {
            console.log(chalk.red(err ||
                "Unsupported node.js version, make sure you have the latest version installed."));
        }
        else {
            var npmCmd = "npm install";
            var lernaCmd = "lerna clean --yes && lerna exec -- rm -rf dist && lerna bootstrap";
            child_process_1.exec([npmCmd, lernaCmd].join("&&"), {
                cwd: cwd
            }, function (err, stdout, stderr) {
                if (err)
                    console.log(err);
            });
        }
    });
};
checkNodeVersion();
