# Pair programming exercise: Ho! Ho! Ho! (Part Deux)

## Goal

Your goal is to extend the [Ho! Ho! Ho! project from yesterday](../day1/hohoho)
to add a few more fun features, taking advantage of the power of mobile:

- Make the login persistent by storing the user's credentials
- Use the swipe gesture to move between screens with a powerful React Native
  plugin
- Share your location with other people via GPS, and view their location on a
  map

## Instructions

Yesterday you learned to build a basic mobile app using the same technologies
you've been learning all summer. Today, we're going to make this app even more
awesome by taking advantage of the full power of mobile to add awesome features
such as maps and gestures.

Continue using your code from yesterday, and continue to use the same backend
endpoint: `https://hohoho-backend.herokuapp.com`. Follow along below to add some
awesome new features to your app.

## Part 1. Persistent login

### Overview

In this part, we will be saving your login information so that your app does not prompt you to login upon restart. The end result will look something like the following:

![Auto-login, wow!](https://s3.amazonaws.com/f.cl.ly/items/342H3W2v312b3v3t1I3K/Screen%20Recording%202016-07-13%20at%2008.05%20AM.gif)

Notice how almost immediately after the Login screen renders, the app recognizes that you have logged in before and switches you into the Users view!

This view will be able to accomplish the following:

- Write to `AsyncStorage` to save a username and password for the next run
- Read from `AsyncStorage` to read the saved data in the `componentDidMount` of the Login view and attempt a login

> **Note:** Make sure to begin by **importing `AsyncStorage` at the top**, the same place you are importing things like `View`, `Alert`, `Button`, `StyleSheet`, etc.!

### Saving into `AsyncStorage`

Usernames and passwords are a basic form of security, but as you've no doubt
noticed by now, the downside is that every time you open the app, you need to
login again. What a pain!

Let's kick things off today by adding a feature common in many popular mobile
apps: persistent login. We're going to do this by storing the username and
password that the user enters so that we can automatically log them in when they
open the app.

The tool we'll use to accomplish this is called [`AsyncStorage`](https://facebook.github.io/react-native/docs/asyncstorage.html),
one of the many powerful APIs available in React Native. `AsyncStorage`, which
is akin to [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
in the browser, allows us to save and read data using a key-value format (the
formal name for this is ["key-value store"](https://en.wikipedia.org/wiki/Key-value_database)).

The `AsyncStorage` API is quite simple. We only have two methods: `setItem` and
`getItem`. As the name suggests, both of these are asynchronous operations, so
both of these methods return a promise.

### Saving the login credentials

Let's start by _saving_ the username and password using `AsyncStorage` when the
user logs in. We can do this by modifying the existing promise chain that is
triggered when the user taps the "Login" button inside `onPress` in your Login
component. Right now, the first thing you do (after, hopefully, validating that
the user entered a username and password!) is fire off `fetch` to login.

After verifying that the user has logged in with correct credentials:
```javascript
AsyncStorage.setItem('user', JSON.stringify({
  username: this.state.username,
  password: this.state.password
}));
```
That's it. Be careful with how you begin the
promise chain and with what goes inside the `.then()` clauses.

> **Remember**: Because we are `stringify`'ing it here, we need to `parse` it later when we read the `user` item!

Obviously, the username and password that we save using `AsyncStorage` will be
overwritten every time the user logins in with another username and password,
but that's fine.

### Reading the login credentials

Reading the credentials is slightly harder. It needs to happen when the
component first loads, but it needs to happen asynchronously. Which [component
lifecycle method](https://facebook.github.io/react/docs/component-specs.html)
does this belong in?

If you guessed `render()`, you guessed wrong (render runs many times, not just
once). If you guessed `addEventListener()`, you're about six weeks late. If you
guessed that you're annoyed by these obnoxious rhetorical questions which serve
no purpose but to make you stop and think about the answer to this question
before just giving it to you--well kudos to you for that. It's
[`componentDidMount`](https://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount).
That's where we put things that run once, and only once, when a component
finishes loading.

Chain a couple of calls to `AsyncStorage.getItem` at the top of this method.
Inside the `then()` clause, check whether we got a username and password (if the
user has never logged in before, they won't be set!), and if we did, try to log
the user in. At a high level, this promise chain should look like:

```javascript
AsyncStorage.getItem('user')
  .then(result => {
    var parsedResult = JSON.parse(result);
    var username = parsedResult.username;
    var password = parsedResult.password;
    if (username && password) {
      return login(username, password)
        .then(resp => resp.json())
        .then(checkResponseAndGoToMainScreen);
    }
    // Don't really need an else clause, we don't do anything in this case.
  })
  .catch(err => { /* handle the error */ })
```

> **Note:** Just to be clear, `login` and
`checkResponseAndGoToMainScreen` are pseudocode. They're not real functions. You
need to fill in functions that actually do these things. And do put them inside
functions--lots of simple, elegant functions is way nicer than tons of code
jumbled together. And you need to do the latter two inside your `onPress`
handler anyway, so putting the code in a function allows you to [avoid
duplication](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).)

See what I did there? There's a promise chain (the one that starts with `login`)
inside of another promise chain (the one that starts with `readUsername...`).
WTF? Yeah, well, you can do that, too--in this case we have to because of the
`if` statement. In other words, **if** we successfully got a username and a
password, then we want to continue the promise chain; if we didn't, we just want
to stop it.

There's one **very very very very** important caveat here. The inner promise
chain **must** have a `return` in front of it. Without this `return`, two things
would (well, wouldn't) happen:

1. If there were additional steps in the outer promise chain, i.e., additional
   `then()` clauses, they wouldn't run
1. Even more alarmingly, **any error thrown inside the inner promise chain would
   be silently swallowed.** They would disappear. Vanish. The `return` causes
   whatever error happened in the inner promise chain to bubble back up to the
   outer chain so that it will be caught by the `catch` handler at the end.
   This is a very, very easy mistake to make. Consider yourself warned! (Read
   more about it here: [We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html).)

Cool beans. So you're a promise ninja and you figured out how to read the
username and password using `AsyncStorage`, and you figured out how to pass
these to the backend to login automatically. Now when you restart your app, you
should be logged in automatically! Keep reading.

>**NOTE:** If you simply click the back button/arrow after signing in, it will take you back to the login page but will **NOT** auto-login. However, restarting the app will auto-login. This is because clicking the back button will navigate back to the login screen but does not call `componentDidMount` again like you might expect.

## Part 2. Share your location

### Overview

Okay, now for the meat of today's project. Delicious, tender, flavorful meat.
Sorry, sorry, that tends to happen a lot when I've had too much Soylent lately 😑

Seriously though, this is where the fun starts. One of the coolest and most
important features of mobile devices is support for location services. Let's add
the ability to not only "Ho! Ho! Ho!" another user, but also to share your
location with them.

At the end of Part 2, your app should be able to send other users locations to the server. We will be modifying the `Users` view to tap and hold on any of the users to send a location rather than a simple _Ho Ho Ho!_

### Modifying `Users` - `App.js`

You already have a `Users` class that shows us a list of users and lets us
message them. We want to do basically the same thing on this view, with a slight
twist: sharing our location. We will modify the rows of users to send a location when someone taps and holds on their name.

Modify your `<ListView />` component in the `Users` class to include two new props: `onLongPress` and `delayLongPress`.

```javascript
<ListView
  dataSource={this.state.dataSource}
  renderRow={(rowData) => (
  <TouchableOpacity
    onPress={this.touch.bind(this, rowData)}
    onLongPress={/* your function here */}
    delayLongPress={/* num of millseconds here */}>
    <Text>{rowData.username}</Text>
  </TouchableOpacity>
  )}
/>
```

`/* your function here */` will become a function that we write in the next section; for now, call this function `sendLocation` and bind it to the `this` context of the component and pass in `rowData`, just like we did for the `onPress` handler to send normal _Ho Ho Ho!_'s.

It will look like: `onLongPress={this.sendLocation.bind(this, rowData)}`


### Getting and sending the location

We will now write the `sendLocation` function to respond to the press-and-hold of any user row. This function will accomplish two things:

- Get the user's current position in latitude and longitude.
- Use `fetch` to send a request to the server that sends a _Ho Ho Ho!_ with a location attached.

Fortunately, Expo makes getting the user's location pretty easy too! The system is documented with examples [here](https://docs.expo.io/versions/v18.0.0/sdk/location.html) but you the most important thing to know is that you're going to be calling `Location.getCurrentPositionAsync`. Granted, you need to make sure the app has the proper permissions first so we'll need to check/ask for that **before** we can try to call that Expo get location function.

Let's start with our two new imports and do note that they come from `Expo` and not `react-native`

```javascript
import { Location, Permissions } from 'expo';
```

Great, now let's start writing our `sendLocation` function

First things first, we are going to use `await` from es6 so let's define an asynchronous function...

```javascript
sendLocation = async(user) => {

}
```

You can read more about async [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) but essentially, this will return an AsyncFunction object, allowing us to use [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) (more info on await in a moment).

```javascript
let { status } = await Permissions.askAsync(Permissions.LOCATION);
if (status !== 'granted') {
  //handle failure
}
```

>**Tip:** `await` from above simply tells our code to wait until the line has finished running, ie a promise was returned

The rest of this and specifically `Permissions.askAsync(Permissions.LOCATION)` will check to see if we have location permissions and ask if we don't currently. We leave up to you to handle the failure to obtain permissions.

Continuing, we add...
```
let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
```

To actually get the current position - finally!

>**Tip:** Try running this now and console.log() the value of the location variable

location will now store an object like this...

```javascript
{
  "coords": {
    "accuracy": 50,
    "altitude": 0,
    "heading": 0,
    "latitude": 37.7761605,
    "longitude": -122.4178688,
    "speed": 0,
  },
  "mocked": false,
  "timestamp": 1499673470734,
}
```

So we simply get the location by accessing the data inside `location.coords`

The final step on this `sendLocation` function is to send a `fetch` request to the server to send a location to another user. It should do basically the same thing as our `touchUser` handler function
with one small difference: in addition to sending a `to` parameter inside the
`body` in the `fetch` call, it should also send the location coordinates. Go
ahead and add the `longTouchUser` function to make it so! The format of the data
that the `fetch` call sends should be:

```javascript
{
  to: <RECIPIENT_ID>,
  location: {
    longitude: /* the received longitude from Expo */,
    latitude: /* the received latitude from Expo */
  }
}
```

Make sure you call this longTouchUser function at the end of your sendLocation function

Note that the backend endpoints remain the same. You should still be calling
`POST /messages`. We use the same set of endpoints for both types of messages,
basic Ho! Ho! Ho!s (see what I did there?), and shared locations. You don't need
to worry about the distinction. Just include the right set of params and the
backend will sort it out for you.

> **Tip:** If you are testing with iOS Simulator, you can change the location of the device! Go to the top menu `Debug > Location > Custom Location...` to select a custom latitude and longitude for simulated current location. Some examples are as follows:
> - **Grand Canyon:** `(36.1128, -113.9961)`
> - **Austin, TX:** `(30.2672, -97.7431)`
> - **International House, PHL:** `(39.9552515, -75.1991039)`


Sweet baby Jesus! We have location data! Now you can find out the user's
location, and share it. For now it's just a bunch of bits and bytes inside an
invisible server somewhere. But that won't be the case for long. Read on, dear
reader, to see why location data is so freaking awesome.

>**Note:** Take a moment to combine the `touchUser` and `longTouchUser` functions. Functions that share so much code like this are often best combined to reduce complexity and the total amount of code in a given file. Not to mention this makes it easier for someone new to understand your code - they don't need to wonder why you have two nearly identical functions or worse yet misread them as the same and delete one!

## Part 3. View shared locations

### Overview

For the final part of this trick, we're going to saw Nihar in half. Just
kidding<sub> \- *probably*</sub>. We love Nihar too much to do that to him. (Now the person in charge of setting up the wifi, that's another story...)

By the end of this part, you will not only be sending locations as with the last part, but be able to see received locations on a map view, **_inline with each message_**.

What we're actually going to do is make all that sweet, juicy location data
visible on a map. We'll stick with our existing `Messages` class, but we'll
extend it by showing maps inline with the _Ho Ho Ho!_'s that contain location data.

By the end of this part, your `Messages` component should display something that looks like the following:

![](https://cl.ly/3l3h2u2w2W35/Simulator%20Screen%20Shot%20Jul%2013,%202016,%208.23.47%20AM.png)


### Modifying the `Messages` Component

To display a message's location with its _From_ and _To_, check for `(rowData.location && rowData.location.longitude)`. If the _Ho Ho Ho!_ contains location data, render an additional component: a
[`MapView`](https://facebook.github.io/react-native/docs/mapview.html) (this is
another Expo builtin, just **_make sure you import `MapView` from expo first at the top of the file_**).

>Note: The expo MapView actually uses [this Airbnb library](https://github.com/airbnb/react-native-maps) if you're interested in the documentation of this view

Pass in the location data (which will be in `rowData.location`, and the name of the message sender, as props when you
display it. You'll want to use the `showsUserLocation` prop to show the _current
user's_ location as a blue dot, the `region` prop to pass in the area where the
map should be centered, and the `annotations` prop to drop a pin to show the
_sender's_ location. Here's a partial example:

```javascript
<MapView
  style={{/*your style here*/}}
  showsUserLocation={true}
  scrollEnabled={false}
  region={{
    longitude: this.props.longitude,
    latitude: this.props.latitude,
    longitudeDelta: 1,
    latitudeDelta: 1
  }}
/>
```

> **IMPORTANT:** Depending on the rest of your code, your MapView may or may not show up if you don't add the needed style

> **Note:** This should not be a standalone component! Your `<MapView />` should be rendered in a typical Messages row below its normal contents.

Make sure there's a way for the user to go back to the messages list from the
map view.

That's it! Pretty awesome, right? Now you have all of the tools you need to
become the next Yo or Snapchat, right?

## Bonus: Navigating with a swiper

Speaking of Snapchat, another great feature we can take advantage of on mobile phones, which isn't
available to us in web apps, is gestures. Mobile devices allow us to use all
sorts of gestures, such as tap, double tap, long tap, swipe, pinch, zoom, and
pan. React Native provides built-in components, such as [`ListView`](https://facebook.github.io/react-native/docs/listview.html)
and [`ScrollView`](https://facebook.github.io/react-native/docs/scrollview.html)
that make common gesture patterns super easy. For more complicated gesture
patterns, there are lots of lovely third party modules.

For this part of the project, we're going to use a module called
[`react-native-swiper`](https://github.com/leecade/react-native-swiper) that
allows us to connect several screens together using a swipe pattern that should
feel familiar from apps such as Snapchat and (the real) Yo. It looks like this:

<img src="https://camo.githubusercontent.com/2bb70cd3dc3b94523811ab1536cc5ad30932d2be/687474703a2f2f692e696d6775722e636f6d2f7a7273617a41472e6769662532303d33303078">

Kick things off by `npm install --save`ing that bad boy, then import the module:

```javascript
import Swiper from 'react-native-swiper'
```

Using the swiper is as simple as creating a new class that contains a few other
classes as children, e.g.:

```javascript
class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };

  render() {
    return (
      <Swiper>
        // First component
        // Second component
        // Third component
      </Swiper>
    );
  }
}
```

In our case, we're going to start by mounting the `Users` and `Messages` views
inside of the `SwiperScreen`. Go ahead and reorganize things now. Here are a few
tips:

- Your `Login` page was loading your `Users` page before. Now you want it to
  load your `SwiperScreen` instead.
- Be careful to update the stack navigator so that you can do this.
- You'll also have to remove the componentDidMount function in `Users` because when we use Swiper, `this.props.navigation` no longer exists and will give us errors.

Pretty cool, right? Now instead of tapping on buttons, which are so 2007, we
can swipe smoothly back and forth across views. See how easy that was?

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

- `POST /messages`: Sends a message/_Ho Ho Ho!_ to another user
  - Parameters:
    - `to`: the ID of the user you are sending a message to
    - `location`: (_Optional_) - an **Object** that represents a sent location in a _Ho Ho Ho!_
      - `latitude`: The latitude of the location
      - `longitude`: The longitude of the location
  - Response codes:
    - `401`: User is not logged in
    - `400`: There was an error saving to database
    - `200`: The _Ho Ho Ho!_ was sent!
  - Example response:

    ```javascript
    {
      "success": true,
      "message": {
        "__v": 0,
        "to": "57849dac19a9131100ab2fe5",
        "from": "578533b8787e661100aec76a",
        "_id": "5785397a787e661100aec7d6",
        "body": "HoHoHo",
        "timestamp": "2016-07-12T18:39:54.406Z"
      }
    }
    ```

## Suggested reading
- [We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)
- [Gesture detection in React Native](http://blog.lum.pe/gesture-detection-in-react-native/)
