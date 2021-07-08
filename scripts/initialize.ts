import * as path from "path";
import * as fs from "fs";
import * as chalk from "chalk";
import { exec } from "child_process";
process.on("unhandledRejection", (err) => {
	throw err;
});

const cwd = process.cwd();

const checkNodeVersion = () => {
	exec("node --version", (err, stdout) => {
		const nodeVersion = stdout && parseFloat(stdout.substring(1));
		if (nodeVersion < 7 || err) {
			console.log(
				chalk.red(
					err ||
						"Unsupported node.js version, make sure you have the latest version installed."
				)
			);
		} else {
			const npmCmd = "npm install";
			const lernaCmd =
				"lerna clean --yes && lerna exec -- rm -rf dist && lerna bootstrap";

			exec(
				[npmCmd, lernaCmd].join("&&"),
				{
					cwd: cwd,
				},
				(err, stdout, stderr) => {
					if (err) console.log(err);
				}
			);
		}
	});
};

checkNodeVersion();