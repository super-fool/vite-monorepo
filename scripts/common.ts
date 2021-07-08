import { exec } from "child_process";
import * as chalk from "chalk";

type Fn = (cb: () => void) => void;

export const checkNodeVersion: Fn = (cb) => {
	exec("node --version", (err, stdout) => {
		const nodeVersion = stdout && parseFloat(stdout.substring(1));
		if (nodeVersion < 7 || err) {
			console.log(
				chalk.red(
					err ||
						"Unsupported node.js version, make sure you have the latest version installed."
				)
			);
		}
		cb();
	});
};
