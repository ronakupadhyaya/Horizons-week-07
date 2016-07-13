# Pair programming exercise: Ho! Ho! Ho! (Part Deux)

## Goal

Your goal is to extend the [Ho! Ho! Ho! project from yesterday](../day2/hohoho)
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

Before doing this, call `AsyncStorage.setItem('username', this.state.username)`
and do the same thing for password. That's it. Be careful with how you begin the
promise chain, and with what goes inside the `.then()` clauses. 

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
readUsernameAndPasswordFromAsyncStorage()
  .then(result => {
    var [username, password] = result;
    if (username && password) {
      return login(username, password)
        .then(resp => resp.json())
        .then(checkResponseAndGoToMainScreen);
    }
    // Don't really need an else clause, we don't do anything in this case.
  })
  .catch(err => { /* handle the error */ }
```

(Just to be clear, `readUsernameAndPasswordFromAsyncStorage`, `login`, and
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

## Part 2. Adding a swiper

Another great feature we can take advantage of on mobile phones, which isn't
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

> ⚠️ You cannot install plugins when you're using RNPlay.org. It's a little
> messy, but as a workaround, copy and paste the text in [this
> gist](https://gist.github.com/lrettig/b34d9b74fac88fe6324a08ddb2efb632)--all
> of it, verbatim--into the bottom of your RNPlay codepen. Check out the [Sample
> RNPlay](https://rnplay.org/apps/iIyfBg).

Using the swiper is as simple as creating a new class that contains a few other
classes as children, e.g.:

```javascript
var SwiperView = React.createClass({
  render() {
    return (
      <Swiper>
        // First component
        // Second component
        // Third component
      </Swiper>
    );
  }
});
```

In our case, we're going to start by mounting the `Users` and `Messages` views
inside of the `SwiperView`. Go ahead and reorganize things now. Here are a few
tips:

- Your `Login` page was loading your `Users` page before. Now you want it to
  load your `SwiperView` instead.
- Be careful to proxy your props down through the new component layer. In plain
  English, if you were previously passing the `navigator` into the `UserView`
  as a prop from the `LoginView`, you'll need to pass it into `SwiperView` now,
  and `SwiperView` will need to pass it on down into its child views.

Pretty cool, right? Now instead of tapping on buttons, which are so 2007, we
can swipe smoothly back and forth across views. See how easy that was? In the
next part we're going to add an _exciting_ and _novel_ new view with a cool new
feature.

## Part 3. Share your location

Okay, now for the meat of today's project. Delicious, tender, flavorful meat.
Sorry, sorry, that tends to happen a lot when I've had too much Soylent lately 😑

Seriously though, this is where the fun starts. One of the coolest and most
important features of mobile devices is support for location services. Let's add
the ability to not only "Ho! Ho! Ho!" another user, but also to share your
location with them.

### Create the class

You already have a `Users` class that shows us a list of users and lets us
message them. We want to do basically the same thing on this view, with a slight
twist: sharing our location. Whenever you recognize this pattern--_I want to do
basically the same thing, with a twist_--you know it's time to modularize your
code. In this case, we want to abstract away the bits of the `Users` class that
we're going to use across both views, the one that lets the user sends messages
and the new one that lets the user share their location.

Create a new React class called `SendMessage` (this will be the view for sending
messages), and cut-and-paste _just_ the `touchUser` handler function from your
`Users` into it. This is the only part that's going to be different between
these two new views--get it? Then add a `render()` method, since every class
needs `render`. What should go into render? Well, it should just render the
underlying `Users` class! The whole thing should look something like this:

```javascript
var SendMessage = React.createClass({
  touchUser() {
    /* your touchUser handler from your Users class */
  },

  render() {
    return <UsersView touchUser={this.touchUser}/>;
  }
});
```

Next we need another new class called `SendLocation`. Do the exact same thing to
create it. You'll also need to update the `render()` method of your `SwiperView`
to display both of the two new classes (and not to display the `Users` class
directly). This will let you swipe back and forth between sending a message and
sharing a location.

### Getting the location

Fortunately React Native makes getting the user's location pretty easy, too. The
whole system is documented [here](https://facebook.github.io/react-native/docs/geolocation.html)
but you only really need to call a single method,
`navigator.geolocation.getCurrentPosition`, which allows us to asynchronously
(big surprise) get the longitude and latitude coordinates of the user's current
location. Add two new properties to the state for `SendLocation`: `longitude` and
`latitude` (remember to initialize them in `getInitialState`--in this case,
initialize them both to zero).

We need to get the user's coordinates once, and only once, when the view loads.
Remember where things of that nature live? Hint: it's one of the React component
lifecycle methods, and you just used it today! Add code that looks like this to
the proper lifecycle method (no need to `import` anything to get this to work):

```javascript
navigator.geolocation.getCurrentPosition(
  position => {
    console.log("Got position:", position);
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  },
  error => alert(error.message),
  {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
);
```

### Sending the location

The final step on the frontend is to add a `touchUser` function to this new
class. It should do basically the same thing as the old `touchUser` function
with one small difference: in addition to sending a `to` parameter inside the
`body` in the `fetch` call, it should also send the location coordinates. Go
ahead and add the `touchUser` function to make it so! The format of the data
that the `fetch` call sends should be:

```javascript
{
  to: <RECIPIENT_ID>,
  location: {
    longitude: this.state.longitude,
    latitude: this.state.latitude
  }
}
```

Note that the backend endpoints remain the same. You should still be calling
`POST /messages`. We use the same set of endpoints for both types of messages,
basic Ho! Ho! Ho!s (see what I did there?), and shared locations. You don't need
to worry about the distinction. Just include the right set of params and the
backend will sort it out for you.

Sweet baby Jesus! We have location data! Now you can find out the user's
location, and share it. For now it's just a bunch of bits and bytes inside an
invisible server somewhere. But that won't be the case for long. Read on, dear
reader, to see why location data is so freaking awesome.

## Part 4. View shared locations

For the final part of this trick, we're going to saw Ethan in half. Just
kidding. We love Ethan too much to do that to him. (Now that annoying person who
always starts vacuuming the hallway when we begin lessons, that's another
story...)

What we're actually going to do is make all that sweet, juicy location data
visible on a map. We'll stick with our existing `Messages` class, but we'll
extend it by indicating which messages contain location data, and by allowing us
to click on them to view the location.

To make it clear which messages contain location data, modify the `renderRow`
prop of the `ListView` in your `Messages` class to add an icon--I recommend the
globe emoji, 🌎--to the appropriate rows. How do you know whether a row contains
location data? Check for `(rowData.location && rowData.location.longitude)`.
Then you need to make these rows touchable, too. You already know how to do
this, too! Wrap the row in a `Touchable` class such as `TouchableOpacity`. Pass
the `rowData` into the `onPress` handler, and check again for the location
data--the handler should do nothing if it doesn't contain location data.

We need to add one final view, to let us see a user's location. Create a new
class that contains just one thing, a
[`MapView`](https://facebook.github.io/react-native/docs/mapview.html) (this is
another React Native builtin, just make sure you import/require it first). Pass
in the location data, and the name of the message sender, as props when you
display it.  You can set the location of the map, drop a pin to represent the
sender's location, _and_ show the _current user's_ location with a blue dot like
this:

```javascript
<MapView
  showsUserLocation={true}
  scrollEnabled={false}
  region={{
    longitude: this.props.longitude,
    latitude: this.props.latitude,
    longitudeDelta: 1,
    latitudeDelta: 1
  }}
  annotations={[{
    latitude: this.props.latitude,
    longitude: this.props.longitude,
    title: this.props.from + "'s Location"
  }]}
/>
```

Make sure there's a way for the user to go back to the messages list from the
map view.

That's it! Pretty awesome, right? Now you have all of the tools you need to
become the next Yo or Snapchat, right?

## Suggested reading
- [We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)
- [Gesture detection in React Native](http://blog.lum.pe/gesture-detection-in-react-native/)
- [Monday's readings on promises](../day1/trello-backup/README.md#suggested-reading) (as if you actually read them all)
