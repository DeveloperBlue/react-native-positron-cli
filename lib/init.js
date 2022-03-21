const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

exports.init = (project_name, options = {}) => {

	console.log(process.env.ComSpec);
	
	const start_timestamp = Date.now();

	console.log(`\nCreating react-native-positron project with name ${project_name}`);

	let BUILD_STEPS = {
		steps : [],
		count : 0,
		add : (fn) => {
			BUILD_STEPS.steps.push(fn);
		},
		hashLog : {},
		printTitle : (title) => {
			let titleHash = crypto.createHash('md5').update(title).digest('hex');
			if (titleHash in BUILD_STEPS.hashLog){
				throw `A BUILD STEP HAS BEEN CALLED MORE THAN ONCE - [${title}]`;
			}
			BUILD_STEPS.count++;
			console.log(`\n[${BUILD_STEPS.count}/${BUILD_STEPS.steps.length}] ${title}`);
			BUILD_STEPS.hashLog[titleHash] = {
				step_start_timestamp : Date.now(),
				title : title
			};
		}
	}

	try {
		process.chdir(process.cwd());
	}
	catch (error) {
		console.log("Error accessing directory");
		console.log(error);
		process.exit(1);
	}

	const project_dir = path.join(process.cwd(), project_name);

	// REACT NATIVE
	let create_react_native = function() {
		BUILD_STEPS.printTitle("Generating React Native project with Typescript Template")
		try {
			execSync(
				`npx react-native init ${project_name} --template react-native-template-typescript`,
				{stdio: 'inherit'}
			);
		} catch (error) {
			console.log(error.message);
			console.log("Error", error.stdout.toString());
			process.exit(1);
		}
		

		try {
			process.chdir(project_dir);
		}
		catch (err) {
			console.log(`Failed to find project directory with name ${project_dir}. Did React-Native fail to generate a project?`);
			console.log(error);
			process.exit(1);
		}
	}

	BUILD_STEPS.add(create_react_native);


	// DEV DEPENDENCIES
	let install_dev_dependencies = function() {
		BUILD_STEPS.printTitle("Adding dev dependencies . . .");
		try {
			execSync(
				`npx add-dependencies ${path.join(project_dir, 'package.json')} \
				webpack \
				webpack-cli \
				webpack-dev-server \
				babel-loader \
				babel-plugin-module-resolver \
				url-loader \
				css-loader \
				style-loader \
				html-webpack-plugin \
				minimist \
				babel-plugin-react-native-web \
				--dev --no-overwrite`,
				{
					stdio:'inherit'
				}
			);
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}

	BUILD_STEPS.add(install_dev_dependencies);

	
	// DEPENDENCIES
	let install_dependencies = function() {
		BUILD_STEPS.printTitle("Adding project dependencies . . .");
		try {
			execSync(
				`npx add-dependencies ${path.join(project_dir, 'package.json')} \
				react-native-web \
				react-dom \
				--no-overwrite`,
				{
					stdio:'inherit'
				}
			);
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}

	BUILD_STEPS.add(install_dependencies)

	// ADD NPM SCRIPTS
	let add_npm_scripts = function() {
		BUILD_STEPS.printTitle("Overwriting npm scripts in package.json . . .");
		try {

			let package_json_contents = fs.readFileSync(path.join(project_dir, 'package.json'), 'utf-8');
			let npm_scripts_contents = fs.readFileSync(path.join(__dirname, '/bundles/npm-scripts.json'), 'utf-8');

			let package_json = JSON.parse(package_json_contents);
			let npm_scripts = JSON.parse(npm_scripts_contents);

			if (options.skipElectron){
				delete npm_scripts['run:electron'];
				delete npm_scripts['build:electron'];
			}

			package_json.scripts = npm_scripts;

			fs.writeFileSync(path.join(project_dir, 'package.json'), JSON.stringify(package_json, null, 2), 'utf-8');

		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}

	BUILD_STEPS.add(add_npm_scripts);

	// ADD JEST TESTING
	let add_jest_config = function() {
		BUILD_STEPS.printTitle("Adding Jest config to package.json . . .");
		try {

			let package_json_contents = fs.readFileSync(path.join(project_dir, 'package.json'), 'utf-8');
			let package_json = JSON.parse(package_json_contents);

			package_json.jest = {
				"preset": "react-native",
				"moduleFileExtensions": [
					"ts",
					"tsx",
					"js",
					"jsx",
					"json",
					"node"
				],
				"moduleNameMapper": {
					"^react-native": "react-native-web"
				}
			}

			fs.writeFileSync(path.join(project_dir, 'package.json'), JSON.stringify(package_json, null, 2), 'utf-8');

		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}

	BUILD_STEPS.add(add_jest_config);

	
	// PROJECT FILES
	let build_project_files = function() {

		BUILD_STEPS.printTitle("Creating project files . . .");
		try {
			fs.mkdirSync(path.join(project_dir, '/src'), { recursive: true });
			fs.mkdirSync(path.join(project_dir, '/src/assets'), { recursive: true });
			fs.mkdirSync(path.join(project_dir, '/src/types'), { recursive: true });
			fs.copyFileSync(path.join(__dirname, '/bundles/index.js'), path.join(project_dir, 'index.js'));

			fs.copyFileSync(path.join(__dirname, '/bundles/tsconfig.json'), path.join(project_dir, 'tsconfig.json'));
			fs.copyFileSync(path.join(__dirname, '/bundles/webpack.config.js'), path.join(project_dir, 'webpack.config.js'));
			fs.copyFileSync(path.join(__dirname, '/bundles/babel.config.js'), path.join(project_dir, 'babel.config.js'));

			let index_html_content = fs.readFileSync(path.join(__dirname, '/bundles/index.html'), 'utf-8');
			fs.writeFileSync(path.join(project_dir, 'index.html'), index_html_content.replace(/##PROJECT-NAME##/g, project_name), 'utf-8');

			fs.copyFileSync(path.join(__dirname, '/bundles/react-native-web-overrides.ts'), path.join(project_dir, '/src/types/react-native-web-overrides.ts'));
			fs.copyFileSync(path.join(__dirname, '/bundles/App.tsx'), path.join(project_dir, 'App.tsx'));

			let git_ignore_content = fs.readFileSync(path.join(project_dir, '/.gitignore'), 'utf-8');
			git_ignore_content = git_ignore_content + `\n\n# react-native-web\n#\npublic/`;

			if (!options.skipElectron){
				git_ignore_content = git_ignore_content + `\n\n# electron\n#\nelectron-app/__webpack-dev-server__/\nelectron-app/build/`
			}

			fs.writeFileSync(path.join(project_dir, '/.gitignore'), git_ignore_content, 'utf-8');


		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}

	BUILD_STEPS.add(build_project_files);

	// ELECTRON DEV DEPENDENCIES
	let install_electron_dev_dependencies = function() {
		BUILD_STEPS.printTitle("Adding electron dev dependencies . . .");
		try {
			execSync(
				`npx add-dependencies ${path.join(project_dir, 'package.json')} \
				electron \
				--dev --no-overwrite`,
				{
					stdio:'inherit'
				}
			);
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}

	// ELECTRON PROJECT FILES
	let install_electron_project_files = function() {
		BUILD_STEPS.printTitle("Creating electron project files . . .");
		try {
			fs.mkdirSync(path.join(project_dir, '/electron-app'), { recursive: true });

			let index_html_content = fs.readFileSync(path.join(__dirname, '/bundles/index.electron.html'), 'utf-8');
			fs.writeFileSync(path.join(project_dir, 'index.electron.html'), index_html_content.replace(/##PROJECT-NAME##/g, project_name), 'utf-8');

			fs.copyFileSync(path.join(__dirname, '/bundles/electron-main.js'), path.join(project_dir, '/electron-app/electron-main.js'));
			fs.copyFileSync(path.join(__dirname, '/bundles/electron-preload.ts'), path.join(project_dir, '/electron-app/electron-preload.ts'));
			fs.copyFileSync(path.join(__dirname, '/bundles/electron-api.ts'), path.join(project_dir, '/src/types/electron-api.ts'));
		} catch (error) {
			console.log(error);
			process.exit(1);
		}	
	}

	// ADD ELECTRON ENTRY TO PACKAGE.JSON
	let add_electron_entry = function() {
		BUILD_STEPS.printTitle("Adding electron entrypoint to package.json . . .");
		try {

			let package_json_contents = fs.readFileSync(path.join(project_dir, 'package.json'), 'utf-8');

			let package_json = JSON.parse(package_json_contents);

			package_json.main = "electron-app/electron-main.js";

			fs.writeFileSync(path.join(project_dir, 'package.json'), JSON.stringify(package_json, null, 2), 'utf-8');

		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}

	if (!options.skipElectron){
		BUILD_STEPS.add(install_electron_dev_dependencies);
		BUILD_STEPS.add(install_electron_project_files);
		BUILD_STEPS.add(add_electron_entry);
	} else {
		console.log('Flagged to skip electron installation')
	}

	//
	//


	let install_package_json = function() {
		BUILD_STEPS.printTitle("Installing compiled directories . . .");
		try {
			execSync(
				`npm install`,
				{
					stdio:'inherit'
				}
			);
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}
	

	if (options.doInstall){
		BUILD_STEPS.add(install_package_json);
	}
	

	//
	//

	BUILD_STEPS.steps.forEach((build_fn) => {
		build_fn();
	})

	//
	//

	

	const done_timestamp = Date.now();

	console.log("\n\nDONE");
	console.group(`Successfully generated a react-native-positron project '${project_name}'`)
	console.log(`Finished in ${(done_timestamp - start_timestamp)/1000} seconds`)
	
}

exports.overbuild = (project_name, options = {}) => {

	// Generate a new react-native project with the updated project name
	// Move android and ios folder, and app.json file, etc. over to existing project
	// rename
}
