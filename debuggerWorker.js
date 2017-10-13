/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
/* global __fbBatchedBridge, self, importScripts, postMessage, onmessage: true */
/* eslint no-unused-vars: 0 */
'use strict';
var got = require('got');
global.Promise = require('bluebird')
var self = global;

function importScripts(url) {
  console.log('\n=== URL ===\n', url);
  return got(url).then(function(response) {
    eval(response.body);
  });
}

function DebuggerWorker() {}

var messageHandlers = {
  'executeApplicationScript': function(message, sendReply) {
    for (var key in message.inject) {
      self[key] = JSON.parse(message.inject[key]);
    }
    let error;
    importScripts(message.url).catch(function(err) {
      console.log('!=== ERROR ===\n', err);
      error = JSON.stringify(err);
    }).finally(function() {
      sendReply(null /* result */ , error);
    });
  }
};

DebuggerWorker.prototype.postMessage = function(message) {
  var object = message;
  var worker = this;

  var sendReply = function(result, error) {
    worker.onmessage({replyID: object.id, result: result, error: error});
  };

  var handler = messageHandlers[object.method];
  if (handler) {
    // Special cased handlers
    handler(object, sendReply);
  } else {
    // Other methods get called on the bridge
    var returnValue = [[], [], [], 0];
    try {
      if (typeof __fbBatchedBridge === 'object') {
        returnValue = __fbBatchedBridge[object.method].apply(null, object.arguments);
      }
    } finally {
      sendReply(JSON.stringify(returnValue));
    }
  }
};

DebuggerWorker.prototype.terminate = function() {
  console.log('\n\nDone!\n\n');
};

module.exports = DebuggerWorker;