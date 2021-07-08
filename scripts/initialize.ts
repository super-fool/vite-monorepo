import { exec } from "child_process";
import { checkNodeVersion } from "./common";
process.on("unhandledRejection", (err) => {
	throw err;
});

const cwd = process.cwd();

const initializeFun = () => {
	const npmCmd = "npm install";

	const lernaCmds = [
		"lerna clean --yes",
		"lerna exec -- rm -rf dist",
		"lerna bootstrap",
	];

	exec(
		[npmCmd, lernaCmds.join(" && ")].join("&&"),
		{
			cwd: cwd,
		},
		(err) => {
			if (err) console.log(err);
		}
	);
};
checkNodeVersion(initializeFun);
