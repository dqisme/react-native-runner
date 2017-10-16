# react-native-runner

Run and Debug React Native in other JavaScript Environment!

## Get Started

1. Start this runner as a debugger: `npm start`
1. Run your React Native application and [start debugging](https://facebook.github.io/react-native/docs/debugging.html)

Now your React Native application is running in your Node.js environment.

## Inspection

You can debug your JavaScript code in Chrome Inspector:

```shell
npm run debug
```

Then open the URL given by the command like this:

```shell
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/remote/serve_file/@60cd6e859b9f557d2312f5bf532f6aec5f284980/inspector.html?experiments=true&v8only=true&ws=localhost:9229/node
```

Your bundled scripts is named as `app.vm` in the source tab of Chrome Inspector.

## Reference

1. [debugger.html @ React Native v0.35](https://github.com/facebook/react-native/blob/v0.35.0/local-cli/server/util/debugger.html)
1. [React Native PR #1632 - Have the chrome debugger run javascript within a web worker, to remove the global document](https://github.com/facebook/react-native/pull/1632/commits/6f36a3317e34fe6a42bb0730ee1ead9ec1424e4c?diff=unified)
1. [WebWorker in react-native-debugger](https://github.com/jhen0409/react-native-debugger/blob/c696a1193f5696b12404018cc6a564cce9ab4cff/app/middlewares/debuggerAPI.js#L47)
1. [vm module in Node.js 6.x](https://nodejs.org/dist/latest-v6.x/docs/api/vm.html)
1. [Deep Diving React Native Debugging](https://medium.com/@shaheenghiassy/deep-diving-react-native-debugging-ea406ed3a691)