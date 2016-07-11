"use strict";

var request = require('request-promise');

var url = 'https://promise-horizons.herokuapp.com/';

// Example code: fetches the first two stages of this exercise.
// We set json: true in options because we want response data to be
// parsed automatically.
request.get(url, {json: true})
  .then(function(resp) {
    // qs: represents the query parameters
    // Note how we need to return the Promise we get back from request.get()
    return request.get(url, {json: true, qs: { key: resp.key, stage: resp.stage + 1 }});
  })
  .then(function(resp) {
    // Response from the second request
    console.log('Success 2:', resp);
    return request.get(url, {json: true, qs: { key: resp.key, stage: resp.stage + 1 }});
  })
  .then(function(resp) {
    // Response from the second request
    console.log('Success 3:', resp);
    return request.get(url, {json: true, qs: { key: resp.key, stage: resp.stage + 1 }});
  })
  .then(function(resp) {
    // Response from the second request
    console.log('Success 4:', resp);
    return request.get(url, {json: true, qs: { key: resp.key, stage: resp.stage + 1 }});
  })
  .then(function(resp) {
    // Response from the second request
    console.log('Success 5:', resp);
  })
// YOUR CODE HERE

// Add code to fetch the next 3 stages of this exercise
// When you're done, you'll see the response:
// {"success":true,"completed":true,"reason":"Congratulations! You've completed this exercise."}
