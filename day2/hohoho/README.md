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

Then you'll need a submit button. Use `TouchableOpacity` for this, with an
`onTouch` handler.

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
to take the user to the next screen of the app. Inside your success promise
chain, you can call `this.props.onForward` to move to the next screen.

## Part 2. Friend list

The main screen of your app is going to contain a list of the user's friends;
tapping one of them would "Ho! Ho! Ho!" them. The easiest and most natural way
to display a list of data in React Native is by [Using a ListView](https://facebook.github.io/react-native/docs/using-a-listview.html).

The first step to add a `ListView` is to import the required object: modify the
`import` statement at the top of `index.ios.js` to import `ListView` like this:

```javascript
import { ..., ListView } from 'react-native'
```

Next we need to add something called a data source to the state for the
`MainScreen` component. In React you learned to do this using the
`getInitialState` lifecycle method; in React Native, using ES6 classes, you'll
do it by adding a `constructor` method to your class, which sets `this.state`.
Instantiate a data source object and add it to your state like this. For now
we'll make it contain a static list of friends:

```javascript
class MainScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataStore: ds.cloneWithRows([
        'Moose', 'Lane', 'Josh', 'Ethan', 'Elon', 'Darwish', 'Abhi Fitness'
      ])
    };
  }
}
```

Let's render the list view. Inside the main `<View>` component in the `render`
method for the view, add a list view component like this:

```javascript
<ListView
  dataSource={this.state.dataSource}
  renderRow={(rowData) => <Text>{rowData}</Text>}
/>
```

Boom! That's it. Now we have a list of friends in our app. Kinda. Of course,
there's no data yet, so the list never changes and you can't add to it, but,
hey, if you're gonna have a static list of friends, that's a hell of a list!

## Part 3. Add a friend

Okay, so you've got some "static" friends, BFD. Let's make things interesting by
tying the friend list to the database so that you can find and add some real
friends instead, and ditch those "static" losers. In Ho! Ho! Ho!, the user can
add a friend in one of two ways:

- By searching for that user, by username, email address, or phone number
- By inviting someone who hasn't yet signed up

In this part, we'll implement the first of these only. The second will be
completed later on.

Let's start by adding a route on the backend to allow the user to add another
user as their friend. It should take a single parameter, `user`, and if it
successfully finds that user, it should add them to the user's friend list in
the database and return the friend's username and ID, otherwise it should return
an error. Create a `POST /friend` route for this.

On the frontend, add another `TextInput` on the main app screen with a button
(`TouchableOpacity` with an `onTouch` handler, as before) that triggers this
HTTP POST request (using `fetch` as before). If it succeeds, display the friend
on the user's screen in the friends list (don't bother waiting for them to
"accept" the request); if not, display an error to the user.

The last thing you need on the backend for this part is another `GET /friend`
route that returns the user's friend list, which we'll load in a moment.

Now that we can get some real data from the backend, let's display it to the
user and make the friend list dynamic.

The tricky part here is that, when the screen first loads, we don't have any
data--so we need to display an empty list, then immediately kick off a request
that downloads the friend list, and then update the list asynchronously when the
request comes back. Welcome to the thrilling world of frontend mobile
development.

In the [React component
lifecycle](https://facebook.github.io/react/docs/component-specs.html) (which
applies to React Native components as well), where do we put code that we want
to run once, and only once, when a component first loads? Answer: in
`componentDidMount`. What do we add there? Answer: a networking call, to
download the friends list.

First add this call as a new function inside the `MainScreen` component, like
this:

```javascript
class MainScreen extends Component {
  ...
  updateList() {
    fetch('http://localhost:3000/friends')
      .then(friends => this.setState({
        dataStore: this.state.dataStore.cloneWithRows(friends)
      }))
      .catch(err => { /* handle the error */ });
```

This will replace the list of friends currently stored in
`this.state.dataSource`, and currently displayed in the `ListView`, with the
list that you just downloaded from the backend.

## Part . Send a Ho! Ho! Ho!

## Part . Receive a Ho! Ho! Ho!

## Part . Send Invite

The first real feature we'll implement is the ability for a user to invite
someone else to the app--because Ho! Ho! Ho! isn't much fun without other
people, right?

The user will enter an email address or a phone number 

Let's start by adding the necessary backend routes. 

## Part . Receive Invite

## Bonus: address book integration

## Bonus: push notifications

## Addendum: Running on a real mobile device

