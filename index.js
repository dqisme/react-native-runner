var WebSocket = require('ws');
var Worker = require('./debuggerWorker');
var host = 'localhost:8081';
var INITIAL_MESSAGE = 'Starting ...';


function connectToDebuggerProxy() {
  var worker;
  var ws = new WebSocket('ws://' + host + '/debugger-proxy?role=debugger&name=Chrome');

  function createJSRuntime() {
    // This worker will run the application javascript code,
    // making sure that it's run in an environment without a global
    // document, to make it consistent with the JSC executor environment.
    worker = new Worker();
    worker.onmessage = function(message) {
      console.log('=== Debugger --> Native ===\n', message);
      ws.send(JSON.stringify(message));
    };
  }

  function shutdownJSRuntime() {
    if (worker) {
      worker.terminate();
      worker = null;
    }
  }

  ws.onopen = function() {
    console.log(INITIAL_MESSAGE);
  };

  ws.onmessage = function(message) {
    if (!message.data) {
      return;
    }
    var object = JSON.parse(message.data);

    if (object.$event === 'client-disconnected') {
      shutdownJSRuntime();
      console.log('Waiting, press <span class="shortcut">' + refresh_shortcut + '</span> in simulator to reload and connect.');
      return;
    }

    if (!object.method) {
      return;
    }

    // Special message that asks for a new JS runtime
    if (object.method === 'prepareJSRuntime') {
      shutdownJSRuntime();
      createJSRuntime();
      ws.send(JSON.stringify({replyID: object.id}));
      console.log('Debugger session #' + object.id + ' active.');
    } else if (object.method === '$disconnected') {
      shutdownJSRuntime();
      console.log(INITIAL_MESSAGE);
    } else {
      // Otherwise, pass through to the worker.
      console.log('=== Native --> Debugger ===\n', object);
      worker.postMessage(object);
    }
  };

  ws.onclose = function(e) {
    shutdownJSRuntime();
    console.log('Disconnected from proxy. Attempting reconnection. Is node server running?');
    if (e.reason) {
      console.log(e.reason);
      console.warn(e.reason);
    }
    setTimeout(connectToDebuggerProxy, 500);
  };
}

connectToDebuggerProxy();