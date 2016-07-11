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

The final task here is to render the list of boards for the user and allow them
to select one. Create a `.hbs` template, pass in the boards data, and when the
user selects a board, take them to a new route, let's call it `/boards/:bid` to
begin the export process!

## Step 3. Write it to the database

## Step 4. Write back to Trello




## Bonus. Save to Google Drive
