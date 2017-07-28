# Week 7 Day 2. Morning Videos & Individual Exercises

## Part 1. MapView

### [Watch Me: Geolocation](https://vimeo.com/224884883)
### [Watch Me: MapView](https://vimeo.com/224886756)

**Open the React Native application in `week07/day2/maps`**

Build a `MapView` that can take you to Istanbul, Sydney, and Hong Kong.
Use 3 buttons (i.e. `TouchableOpacity`s) at the top of the screen to change
the region the map is currently displaying.

<details><summary>
Hint
</summary><p>

Use the `region` property instead of the `initialRegion` property if you want
to be able to change a `MapView` region via state.

</p></details>

<details><summary>
Coordinates
</summary><p>

- Istanbul: 41.067841, 29.045258
- Sydney: -33.866174, 151.220345
- Hong Kong: 22.294074, 114.171995

</p></details>

### Result

![Goal animated screenshot](https://cl.ly/1e0x3c430D2C/Screen%20Recording%202017-07-11%20at%2012.10%20AM.gif)

### Links

- [AirBnB React Native Maps documentation](https://github.com/airbnb/react-native-maps)

## Part 2. Geolocation

Add a 4th button to the top of the screen that centers the map on the the users'
current location.

<details><summary>
Hint
</summary><p>

When the user clicks the `Here` button, request location information with
`navigator.geolocation.getCurrentPosition()` and call `this.setState()`
in the success callback.

</p></details>

### Result

![Goal animated screenshot](https://cl.ly/0k1F0g1Y001j/Screen%20Recording%202017-07-11%20at%2012.06%20AM.gif)

### Links

- [React Native geolocation documentation](https://facebook.github.io/react-native/docs/geolocation.html)
- [MDN navigator.geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation)

## Part 3. AsyncStorage

### [Watch Me: AsyncStorage](https://vimeo.com/224880785)

Use `onRegionChangeComplete` to detect when `MapView` is moved. Inside the
`onRegionChangeComplete` callback use `AsyncStorage` to store new location.

When the component is first loaded use `componentDidMount()` to read
the last location from `AsyncStorage` and restore the map to its last location.

### Result

![Goal animated screenshot](https://cl.ly/0Y1B2b413q2l/Screen%20Recording%202017-07-11%20at%2012.22%20AM.gif)

### Links

- [React Native AsyncStorage documentation](https://facebook.github.io/react-native/docs/asyncstorage.html)
