"use strict";
exports.__esModule = true;
exports.checkNodeVersion = void 0;
var child_process_1 = require("child_process");
var chalk = require("chalk");
var checkNodeVersion = function (cb) {
    child_process_1.exec("node --version", function (err, stdout) {
        var nodeVersion = stdout && parseFloat(stdout.substring(1));
        if (nodeVersion < 7 || err) {
            console.log(chalk.red(err ||
                "Unsupported node.js version, make sure you have the latest version installed."));
        }
        cb();
    });
};
exports.checkNodeVersion = checkNodeVersion;
