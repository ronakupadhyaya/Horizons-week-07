"use strict";

var request = require('request-promise');

var url = 'https://promise-horizons.herokuapp.com/';

// This code fetches the first two stages of this exercise
request.get(url, {json: true})
  .then(function(resp) {
    return request.get(url, {json: true, qs: { key: resp.key, stage: resp.stage + 1 }});
  })
  .then(function(resp) {
    console.log('Success 2:', resp);
  })
// YOUR CODE HERE

// Add code to fetch the next 3 stages of this exercise
// When you're done, you'll see the response:
// {"success":true,"completed":true,"reason":"Congratulations! You've completed this exercise."}
