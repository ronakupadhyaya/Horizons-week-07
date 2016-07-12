---
breaks: false
---
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

- Register
- Login
- List all users
- Send a HoHoHo to users
- List messages sent and received
- (Bonus) Implement pull to refresh

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

## Part 1. Registration

### Overview

For registration, we will be creating a screen that _looks like_ the following:

![](img/register.png)


Your registration screen should be able to _do_ the following:

- Take a username as an input
- Take a password as an input
- Make a `POST` request to a server (API reference provided, see **_Endpoint Reference_**).


### Creating Components - `index.ios.js [Register]`


Let's create the registration screen.

The first thing you'll notice is the boilerplate code for `NavigatorIOS` inside the
root component at the top of `index.ios.js`, which allows us to
move forward and backward among a series of screens in our app, for instance,
from a Login screen to a Main screen. Don't worry too much about this for now.
Just use the boilerplate code to build these two screens.

On the registration screen, use `TextInput` components for the form fields, with a
callback to pass the value to the state, like this:

```javascript
<TextInput
  style={{height: 40}}
  placeholder="Enter your username"
  onChangeText={(text) => this.setState({username: text})}
/>
```

You can find more information in [Handling text input](https://facebook.github.io/react-native/docs/handling-text-input.html).

You will need two of these `<TextInput />` components, once for maintaining a state for `username`, and another storing state for `password`. Both of these will be used upon submitting the registration!

Then you'll need a submit button. Use `TouchableOpacity` for this, with an
`onPress` handler. If you need an example for `TouchableOpacity`, take a look at the scaffolding for the `<Login />` component we provided for you. If you want to hide the user input (say, for passwords), add the prop: `secureTextEntry={true}`.

> **Tip:** We also created some preset styles, such as `styles.button` and `styles.buttonBlue` , `styles.buttonGreen`, and `styles.buttonRed`. Feel free to add your own in the `StyleSheet` at the bottom!

Once you've got and validated the input values, you can make an HTTP POST
request with the username and password to the backend route like this:

```javascript
fetch('https://hohoho-backend.herokuapp.com/register', {
  method: 'POST',
  body: JSON.stringify({
    username: 'theValueOfTheUsernameState',
    password: 'theValueOfThePasswordState',
  })
})
.then((response) => response.json())
.then((responseJson) => {
  /* do something with responseJson and go back to the Login view but
   * make sure to check for responseJson.success! */
})
.catch((err) => {
  /* do something if there was an error with fetching */
});
```

Instead of using `$.ajax()`, in React Native we use the `fetch` command to make
an HTTP request. The syntax is slightly different, since `fetch` returns a
promise. The `then` clause contains a success and an error handler. Read more
about this in [Networking](https://facebook.github.io/react-native/docs/network.html).

⚠️ **Warning:** Make sure to call `.then(response => response.json())` (like above) **before any other `.then` statements** to turn the raw response into JSON that you can process in subsequent `.then`'s.

Awesome! If you've gotten a successful response from the server, now it's time
to take the user to the next screen of the app. Inside your success promise
chain, call the `this.props.navigator.pop()` to use the `NavigatorIOS` component to bring us back to our previous view - the Login view. 

### End Result, Part 1

By the end of Part 1, make sure that you are able to access your registration view upon load of the app, enter in registration details (username and password), and successfully get a response back from the server. Upon successful registration, your app should bring you back to the Login view to login with the details you just registered with.

Congratulations! You've built your first native application view - in the next part, we'll build login in much the same way we did with registration, using `fetch` for handling network requests with our backend, and calling methods on our `NavigatorIOS` to bring us into different views. 

## Part 2. Login

### Overview

For login, we will be creating a view that looks like the following:

![](img/login.png)

This view will be very similar to registration - we will only need to change the routes we use for `fetch` and change what happens upon success.

## Part 3. User list

![](img/users.png)

TODO update section

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


## Part 4. Send a HoHoHo

![](img/sent.png)

TODO update section

## Part 5. Messages list

![](img/messages.png)

TODO update section

## Bonus. Pull to refresh

TODO update section

Update your message and user views to be able to perform a
[pull to refresh](https://facebook.github.io/react-native/docs/refreshcontrol.html).

## Part 4. Send a HoHoHo

TODO This section below is mostly irrelevant now

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

## Endpoint Reference - `https://hohoho-backend.herokuapp.com/`

**Base URL:** https://hohoho-backend.herokuapp.com/

All endpoints accept JSON data and return JSON data. All responses include
a boolean `success` field that indicates if request was successful.
You can also use the response status code to figure out if a request
was successful.

- `POST /register`: Register a new user. Does **not** automatically log user in.
  - Parameters:
    - `username`: Required String
    - `password`: Required String
  - Response codes:
    - `400`: Bad user input, includes `error` field indicating cause
    - `200`: Registration successful
- `POST /login`: Log in as a pre-existing user.
  - Parameters:
    - `username`: Required String
    - `password`: Required String
  - Response codes:
    - `400`: Bad user input, includes `error` field indicating cause
    - `401`: Bad username or password, includes `error` field indicating cause
    - `200`: Login successful
- `GET /login/success`: Check if the user is logged in
  - Parameters: **none**
  - Response codes:
    - `401`: User is not logged in
    - `200`: User is logged in
- `GET /users`: Get all registered users in HoHoHo
  - Example response:

  ```javascript
  {
    "success": true,
    "users": [
      {
        "username": "moose",
        "_id": "57844cbdbedf35366e2690d3"
      },
      {
        "username": "dar",
        "_id": "57846e7666b869d88ad96430"
      },
      {
        "username": "other",
        "_id": "57846fea0ccbba228cd1479e"
      },
      {
        "username": "other2",
        "_id": "57846ff00ccbba228cd1479f"
      }
    ]
  }
  ```

- `GET /messages`: Get messages sent to and from current user
  - Example response:

  ```javascript
  {
    "success": true,
    "messages": [
      {
        "_id": "57846f6cafacd3988b4362e6",
        "to": {
          "_id": "57846e7666b869d88ad96430",
          "username": "dar"
        },
        "from": {
          "_id": "57844cbdbedf35366e2690d3",
          "username": "moose"
        },
        "__v": 0,
        "body": "Yo",
        "timestamp": "2016-07-12T04:17:48.304Z"
      }
    ]
  }
  ```