# Palgo <img src="assets/icons/png/icon.png" width="50">

### Description

A native app for all major operating systems (macOS, Linux, Windows) that will help students
visualize algorithms in order to understand better what is happening "under the hood".

Built with ❤️  using Electron, NodeJS, VisJS and many other amazing open source libraries.

### How to run (development mode)

Before starting the app, set the NOKQUEUE environment variable equal to 1 as shown:

```bash
$ export NOKQUEUE = 1
```

Afterwards, you can install dependencies, build and start the app with the following commands:

```bash
$ npm install
$ npm build
$ npm start
```

### How to test

```bash
$ npm test
```

### Roadmap

Change to ClojureScript and Om framework, generalize the algorithm animation skeleton so that implementing new ones
would be easier for developers.
