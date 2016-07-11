# Pair programming exercise: Ho! Ho! Ho!

## Goal

Your goal is to create a simplified clone of the [Yo
app](https://www.justyo.co/), a "contextual messenger" that lets you send a
simple "Yo" message to friends (if you haven't heard of Yo already, [read about
it
here](http://www.businessinsider.com/whats-happened-to-7-million-app-yo-now-that-the-hype-has-died-2014-9)).
You'll build this app using React Native and run it on the mobile platform of
your choice, iOS or Android.

Your app will have the following features:

- Login/register
- Find friends who are already users (search by name, phone number, or email)
  and invite friends via email or SMS
- Invitees can accept invitations and the relationship is then established; they
  are invited to download the app, but can also "Ho! Ho! Ho!" the sender
  directly via the web from the link they received
- Tap on a friend's name in the app to "Ho! Ho! Ho!" them

## Instructions

If you haven't already, start by following the instructions in [today's warmup
exercise](../warmup.md) to install the required components for React Native.

This is going to be the first project where your frontend and backend code are
totally separate. Your frontend will be running on a mobile phone (or in a
mobile emulator), via React Native; your backend will be an express app, which
you've seen many times by now. Find the scaffold for the backend app in
`hohoho-backend/` in this folder, and find the scaffold for the frontend app in
`hohoho-frontend/`.

You can start the backend by running `npm start` or `nodemon` in the
`hohoho-backend/` directory.

To start the frontend code in the iOS simulator, `cd` into the
`hohoho-frontend/` directory in the terminal and run `react-native run-ios`.

*FILL IN INFO ON WINDOWS AND ANDROID STUDIO*

## Part 1. Login

### Backend

Since your frontend and backend are completely disjoint, you no longer have the
option of letting the user authenticate--or do anything else--on the backend.
100% of the data your app needs must be sent and received via a REST API, so
it's critical that you spend some time thinking and planning which routes you
will need for each of the app's features.

Let's start with login. At minimum, you will need the following routes:

- `POST /login`: Send a username and password; authenticates the user via
  Passport and logs them in, then returns user info, or an error on failure
- `POST /register`: Send a username and password to create a new user; returns
  the new user info, or an error (if e.g. the username is already taken)

These routes are filled in for you. Remember, *there is no user on a web browser
viewing our app on the web!* This has big implications for the format of the
data that we return, how we handle errors, etc. For example, if the user tries
to access a protected resource without logging in, there's no point in
attempting to redirect them to a login page--since a.) there is no web-based
login page, and b.) even if we tried, the app would ignore the redirect.
Instead, we need to use [HTTP status
codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) to send
meaningful success and error messages to the app. Code 401 means "unauthorized",
so it should tell the app that the user needs to login before accessing this
resource.

To add support for other authentication providers, such as Facebook, we'll have
to add additional routes.

### Frontend

Back on the frontend, let's create the login screen.

The first thing you'll notice is the boilerplate code for `Navigator` inside the
root component at the top of `hohoho_frontend/index.ios.js`, which allows us to
move forward and backward among a series of screens in our app, for instance,
from a Login screen to a Main screen. Don't worry too much about this for now.
Just use the boilerplate code to build these two screens.

On the login screen, use `TextInput` components for the form fields, with a
callback to pass the value to the state, like this:

```javascript
<TextInput
  style={{height: 40}}
  placeholder="Enter your username"
  onChangeText={(text) => this.setState({username: text})}
/>
```

You can find more information in [Handling text input](https://facebook.github.io/react-native/docs/handling-text-input.html).

Once you've got and validated the input values, you can make an HTTP POST
request with the username and password to the backend route like this:

```javascript
fetch('http://localhost:3000/login', {
  method: 'POST',
  body: JSON.stringify({
    username: 'yourValue',
    password: 'yourOtherValue',
  })
})
.then(
  // success handler
  (response) => { /* do something with the response */ },
  // error handler
  (err) => { /* handle the error */ });
```

Instead of using `$.ajax()`, in React Native we use the `fetch` command to make
an HTTP request. The syntax is slightly different, since `fetch` returns a
promise. The `then` clause contains a success and an error handler. Read more
about this in [Networking](https://facebook.github.io/react-native/docs/network.html).

Awesome! If you've gotten a successful response from the server, now it's time
to take the user to the next screen of the app.

## Part . Send Invite

## Part . Receive Invite

## Part . Friend List

## Part . Send a Ho! Ho! Ho!

## Part . Receive a Ho! Ho! Ho!

## Bonus: address book integration

## Bonus: push notifications

## Addendum: Running on a real mobile device

