<h1 align="center">
  <a href="https://github.com/DeveloperBlue/react-native-positron-quickstart">
    React-Native-Positron CLI
  </a>
</h1>

<p align="center">
  <strong>Build native mobile applications, desktop applications, and web applications with React</strong>
</p>

![Snapshot of React Native Positron running in React Native, Electron, and the web](https://github.com/DeveloperBlue/react-native-positron-quickstart/blob/main/repository-banner.png)


[React-Native-Positron (RNP)](https://github.com/DeveloperBlue/react-native-positron-quickstart) is a project that bundles React Native, React-Native-Web, and Electron. It allows you to build cross-platform applications for Android, iOS, Windows, MacOS, Linux, and the web— all from one codebase.

## Usage

```bash
# Generate a react-native-positron project in the current working directory and run npm install
npx react-native-positron-cli init <PROJECTNAME> --install
```

```bash
# See usage examples
npx react-native-positron-cli --help
```

Alternatively, if you'd like to generate a project without electron for  targetting Android, iOS, and the web, you can pass an ``electron=false`` argument:
```bash
# Generate a react-native-positron project in the current working directory without electron support and run npm install
npx react-native-positron-cli init <PROJECTNAME> electron=false --install
```

## React Native Positron Quickstart
You can check out a boilerplate [React Native Positron Quickstart](https://github.com/DeveloperBlue/react-native-positron-quickstart) Project for a project template and showcase of react-native-positron's capabilities.

## Medium Project Writeup
You can read more about how RNP works and build your own application by checking out my [Project Writeup on Medium](https://medium.com/@michaelrooplall/building-cross-platform-applications-for-android-ios-windows-macos-linux-and-the-web-using-2586fdb2e3da).
