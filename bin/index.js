#!/usr/bin/env node

let lib = require('../lib/init.js');

const argv = require('minimist')(process.argv.slice(2), {
	alias : {h : 'help'}
});

if (argv['_'][0] == 'init'){
	const project_name = argv['_'][1];

	const skipElectron = (argv['electron'] == false);
	const doInstall = (argv['install']);

	lib.init(project_name, { skipElectron, doInstall });
} else {
	argv['help'] = true;
}

if ('help' in argv){
	console.log(`
React Native Positron CLI
By Michael Rooplall <michaelrooplall@gmail.com>

	Usage:
		init <PROJECTNAME> [electron=false] [--install]		Generate react-native-positron project

			Use electron=false to only build for native mobile applications and the web.
			Electron is included by default.
			Use the --install flag to automatically run 'npm install' after the project is generated.
			It is not run by default.
	
	Options:
		-h, --help						print usage information


This is not a production-ready tool. Do not use it as such.
Check out the quickstart here: https://github.com/DeveloperBlue/react-native-positron-quickstart
`)
	process.exit(0);
}


