# Pair programming exercise: Trello backup engine

## Goal

Your goal is to write a webapp that allows a user to backup a Trello board,
including all of its cards and metadata, to a Mongo database. The user can also
perform a restore operation, creating a new Trello board from the contents of a
Mongo database.

## Instructions

Recall the [Trello CSV
project](https://github.com/horizons-school-of-technology/week03/tree/master/day2/trello-csv)
from week 3. This project has several key differences:

- You're storing data in the database, rather than in a CSV file
- You're using OAuth to access the Trello API, rather than just a key
- You're using promises, glorious promises! This will make the async calls much
  easier.

Start with an `express` scaffold--feel free to use `express-generator` as in
past projects, and don't forget the `--hbs` argument to add Handlebars support.

## Step 1. Trello authentication

We'll be using your old friend passport for this part. `npm install` it, along
with `express-session` and the
[`passport-trello`](https://github.com/fuwaneko/passport-trello) module. There's
very minimal documentation for `passport-trello`, but fortunately you've already
done OAuth using Facebook, Spotify, Soundcloud, or another OAuth provider a
bunch of times by now so easy-peasy, right?

Add the two auth routes: the first one (`/auth/trello`) should install the
`passport.authenticate('trello')` middleware and the second
(`/auth/trello/callback`) should install middleware which looks something like
this: `passport.authenticate('trello', {failureRedirect: '/login'});`.

Finally, add a `passport.use` passport strategy middleware call in `app.js` to
configure the `TrelloStrategy`, which should look like this: `passport.use(new
TrelloStrategy(options, callback)`. The `options` object takes several keys:

- `consumerKey`: Your Trello API key, from https://trello.com/app-key.
- `consumerSecret`: OAuth secret from the bottom of the same page.
- `callbackURL`: Same as with Facebook and other OAuth providers, you need to
  pass the full URL to your `/auth/trello/callback` route here.
- `passReqToCallback`: Whether or not to pass the `req` object to the callback
  function.
- `trelloParams`: Here's where you specify arguments to the Trello API. Pass in
  these args:
  - `scope`: `read,write`
  - `expiration`: `never`
  - `name`: `<the name of your app>`

The `callback` function should take the following arguments: `req`, `token`,
`tokenSecret`, `profile`, `done`:
  - `req`: You already know what this is.
  - `token`: The token you can subsequently pass to API calls to authenticate as
    the user.
  - `tokenSecret`: You don't need this right now.
  - `profile`: Information on the user, including their ID, name, and a bunch of
    other data.
  - `done`: The passport callback to indicate whether the authentication was
    successful.

Ordinarily, with passport, at this stage (inside the callback) we'd look up the
user in the database using the remote auth provider ID, or we'd create a new
user object if no match was found. But we don't strictly need to save a user to
the database in this case. Think about why not.

Instead of looking up/creating a new user, upon authentication success, why not
just return a "fake user" object containing just the information you need--in
this case, the `token` and `profile` objects passed into the callback? As far as
passport is concerned, a "user" can be any JavaScript object, e.g.:

```javascript
{
  token: token,
  profile: profile
}
```

The only trick is that you need to supply `passport.serializeUser` and
`passport.deserializeUser` callbacks as well, which convert the user object to a
string and restore it from a string, respectively. How do we convert a simple
JavaScript object to a string? You guessed it... JSON! Your `serializeUser`
callback should call its `done` callback with the output of `JSON.stringify` on
the user object, and your `deserializeUser` callback should call its `done`
callback with the output of `JSON.parse` on the input object.

You'll also want to redirect the user to another route, let's call it `/boards`,
upon success, to select a board. Read on, dear student.

## Step 2. Download the board

Okay, at this point the user has successfully authenticated via
`passport-trello` and you should've saved the Trello token and user profile into
the `req.user` object. Super cool. The next step is to display a list of the
user's current Trello boards, so that they can choose one to export.

In the Trello CSV file we used the
[`trello`](https://github.com/norberteder/trello) node module to access the
Trello API, so let's do the same thing here--but this time using promises
instead of callbacks! Per the
[instructions](https://github.com/norberteder/trello) the first step is to
initialize the module like this:

```javascript
var Trello = require("trello");
var trello = new Trello("MY APPLICATION KEY", "MY USER TOKEN");
```

As above, the application key is the same Trello API key that you used to
configure `passport-trello`. And the token? You just got that via OAuth! And it
should be stored in your `req.user` object. So we have all the information we
need to make an API call authenticated as the user.

Let's add a `GET /boards` route that displays a list of boards and allows the
user to choose the board to export. It should read the OAuth token from
`req.user.token`, initialize the Trello module using the token, then make an
authenticated call to `getBoards` to get the list. Instead of passing in a
callback to `getBoards`, handle the return value, and the error, using the
promise it returns, like this:

```javascript
trello.getBoards("me").then(boards => {
  // do something with boards data
}).catch(err => {
  // handle the error
});
```

Note that the Trello API has a funny way of returning errors. Many errors
actually do not cause the promise to reject and trigger the error handler;
instead the "success" handler gets called, but instead of receiving the data it
expects--in this case, a list of boards--it receives a string containing an
error message. In this case you should use `Array.isArray(boards)` to check if
you got a list of boards, or if you got an error string instead, and handle the
error appropriately.

Note also that there's scant documentation on this Trello node module. The best
thing to do is just to look inside
[`main.js`](https://github.com/norberteder/trello/blob/master/main.js) and find
the functions you need there--for example, try searching for the word "board".

The final task here is to render the list of boards for the user and allow them
to select one. Create a `.hbs` template, pass in the boards data, and when the
user selects a board, take them to a new route, let's call it `/boards/:bid` to
begin the export process!

## Step 3. Read board data from Trello API

Now for the fun part. The user has selected a board by calling `GET
/boards/:bid` with the board ID. Let's download the board and store its contents
into a Mongo database. This will require a slightly tricky series of API
calls--this is where promises will really shine. Slide open your Promisghini's
suicide doors and let's try to open her up a little bit.

All we have to start with is a board ID. (You could pass the board name, too,
but the name could change between the time you read it and the time you write
it, so it's best to look it up again.) We must do the following:

- call `getBoards` again to get the latest metadata for this board
- call `getListsOnBoard` to get the list of lists on this board, including their
  metadata
- call `getCardsOnBoard` to get the list of cards on this board

Think about whether the order of these calls matters. Do we need to do them in
sequence, or can we speed things up by running all of these calls in parallel?

Do any of the calls depend on the results of another call?

In this particular case, no: we already have all of the data we need for each of
these three calls. For the first, `getBoards`, as before, we just pass in "me"
for a list of my boards. For the second and third, we just need to pass in the
board ID (req.params.bid).

Promises are good at chaining, which lets you run a series of asynchronous calls
and handle all errors at the end. This is one way to avoid "callback hell" (read
more about the phenomenon
[here](http://colintoh.com/blog/staying-sane-with-asynchronous-programming-promises-and-generators),
[here](http://callbackhell.com/) and
[here](http://stackabuse.com/avoiding-callback-hell-in-node-js/)--Taylor I'm
looking at you 😬). You can run a series of async calls thus:

```javascript
firstCall()
  .then(secondCall)
  .then(thirdCall)
  ...
  .catch(errorHandler);
```

But we can also execute a series of calls in parallel--firing them all off, and
waiting for them all to come back--very elegantly by using
[`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).
If you ever tried to make several API calls and corral their results using
callbacks, you know how frustrating this is without promises (Omar, Serena,
Caitlin, I got y'all 👊). With `Promise.all` it's as easy as:

```javascript
Promise.all([firstCall(), secondCall(), thirdCall()])
  .then(results => { /* handle results */ })
  .catch(errors => { /* handle errors */ });
```

The results, and errors, come back in the same order as the calls were passed
into `Promise.all`.

Try kicking off all three API calls in parallel this way, and checking the
results/errors that come back. Then let's move on to writing all this junk back
to the database.

## Step 4. Saving to the database

Thanks to the incomparable beauty and elegance of promises, you have now
successfully corralled all of the board data inside your `GET /board/:bid`
endpoint. Let's go ahead and write it to the database.

First, we need a Mongoose model to store a board. As you've no doubt noticed,
Trello stores tons and tons of metadata on its boards, lists, and cards. For our
purposes, we're just going to store the following:

- Boards: board `name` and `id`
- Lists: list `name` and `id`
- Cards: card `name`, `id` and `desc`

There are lots of ways we could choose to store these data in our database. We
could create three separate models, one for each, then link them together using
[ObjectID refs and populate](http://mongoosejs.com/docs/populate.html). That
would make sense if list existed independently of boards (e.g., if they could be
on multiple boards at the same time) or if cards existed independently of lists.
Is that the case here? Not as far as I know. So the right way to do this is
probably using [sub-docs](http://mongoosejs.com/docs/subdocs.html) instead.

If we were storing boards, lists, and cards independently of one another, we
would need to link them using IDs (foreign keys): a board would need to store a
list of list IDs and/or a list would need a board ID. This is how the data you
receive from Trello is structured. However, if we choose to use subdocs, we
don't strictly need to store these IDs anywhere, since the association is
implicit. See the next part on how to reconstruct the data.

Create a single top-level `board` model to contain your board with its lists and
cards. Note that you may choose to specify one large schema containing the
subdoc schemas inline, like this:

```javascript
var parentSchema = new Schema({
  ...
  children: [{
    name: String,
    ...
  }],
  ...
});
```

Or you may instead choose to create the schemas independently and link them
together:

```javascript
var childSchema = new Schema({...});
var parentSchema = new Schema({
  ...
  children: [childSchema],
  ...
});
```

Either way, you'll first need to create the parent document, then you'll need to
add each of the children. Another benefit to mongoose subdocs is that *you don't
need to save every time you add a subdoc,* you can do one final `save()` on the
parent at the end after adding all of the subdocs, and errors from the subdocs
will bubble up. Take a moment now to RTFM: [Sub Docs](http://mongoosejs.com/docs/subdocs.html).

When performing an async operation with Mongoose, do it using promises instead
of callbacks! For instance, `document.save().then(...)`.

Remember! Promises can (and should!) be chained! Inside a `then` clause, you can
return a new promise, which will continue the chain. You need to connect your
Mongoose code to your Trello API code in a single chain, which should look
something like this:

```javascript
Promise.all(/* list of Trello API promises from above */)
  .then(result => {
    /* Create your Mongoose object and save it here!
       Return the promise that save() returns here to continue the chain,
       for example: */
    ...
    return MyModel.save()
  })
  .then(result => { /* handle success case */ })
  .catch(err => { /* handle error case */ });
```

One final note on chaining promises: rather than doing things serially, and
worrying about what comes next after each async step inside the callback for
that step, promises encourage us to take a high-level look at all of our async
requests--what order they happen in, what depends upon what, what can be
parallelized and what has to happen serially, etc. Read [Flattening Promise
Chains](http://solutionoptimist.com/2013/12/27/javascript-promise-chains-2/) for
a great overview of how to do this.

## Step 5. Write back to Trello

You've gotten this far, this is the easy part. You just need to make the whole
process work in reverse.

You'll need to add another route to your app, let's call it `GET /restore`, that
displays a list of boards that you've backed up in your database, and a `GET
/restore/:bid` to kick off the restoration process for one board. Similar to
before, the user should have the option to click a board, which would start the
restore process by doing everything in reverse: read the board data from Mongo
and execute a series of Trello API calls to write the data to Trello. Give some
thought as to whether you want to *overwrite* the board data already in
Trello--and to how you would do that--or whether you just want to restore by
creating a new board.

As discussed above, if we're using subdocs in mongoose, we don't need to
explicitly specify which lists belong to which board, which lists a board
contains, etc. with lists of IDs. The relationship is implicit: when we look up
a board, it contains lists as subdocs, and those lists contain cards as subdocs.
We don't even need to use `populate` in this case. You can run:

```javascript
Board.findById(bid).then(board => {
  /* Create the board using Trello API, save its lists (board.lists),
  and save the cards for each of those lists (e.g., board.lists[0].cards) */
}).catch(err => { /* handle error */ });
```

This time, you'll have to chain your promises in the opposite direction too!
Kick off the promise chain with a mongoose `find` operation of one sort or
another, and then once you've gotten all of the data you need from the database,
fire off one or more Trello API calls such as `addBoard`, `addListToBoard`,
`addCard`, etc. As above, spend some time designing how you're going to do this.
Which steps need to happen serially (because one depends upon another), and
which steps can happen in parallel? In the first case, chain the promises using
`then()`; in the second case, use `Promise.all()` as above.

## Bonus. Save to Google Drive

If you're feeling ambitious and want a little more practice with promises, APIs,
and asynchronicity, add another option to your backup app: back up the contents
of a Trello board to a CSV file inside your Google Drive account. Use the same
CSV format we used in the [Trello CSV
project](https://github.com/horizons-school-of-technology/week03/tree/master/day2/trello-csv).
Start by reading about the [Google Drive API](https://developers.google.com/drive/v2/reference/),
the [Google Drive API node quickstart](https://developers.google.com/drive/v3/web/quickstart/nodejs),
and about how to integrate a Google Drive file selection widget into your app at
[Open and upload files using the Google Picker API](https://developers.google.com/drive/v3/web/integrate-open) and
[Picker API Developer's Guide](https://developers.google.com/picker/docs/).

## Suggested reading
- [Promise reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [You're missing the point of promises](https://blog.domenic.me/youre-missing-the-point-of-promises/)
- [JavaScript Promises tutorial](http://www.html5rocks.com/en/tutorials/es6/promises/)
- [Flattening Promise Chains](http://solutionoptimist.com/2013/12/27/javascript-promise-chains-2/)
