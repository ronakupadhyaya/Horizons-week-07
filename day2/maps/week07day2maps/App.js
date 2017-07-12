// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// import App from './week07day2maps/App.js'

import React from 'react';
import {
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      lat: 0,
      long: 0 
    }; 
  }

  currentLocation () {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        AsyncStorage.setItem('location', JSON.stringify ({
          lat: success.coords.latitude, 
          long: success.coords.longitude
        }))
        .then(() => 
          this.setState({
            lat: success.coords.latitude, 
            long: success.coords.longitude
          })
        )
      }, 
      (error) => {
        console.log('Error = ', error)
      },
        {}
    )
  }; 

  componentDidMount() {
    AsyncStorage.getItem('location')
    .then((result) => {
      return JSON.parse(result)
    })
    .then((obj) => {
      console.log('obj = ', typeof obj)
      this.setState({
        lat: obj.lat, 
        long: obj.long
      })
      console.log('this.state = ', this.state)  
    })
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                AsyncStorage.setItem('location', JSON.stringify({
                  lat: 41.067841, 
                  long: 29.045258
                }))
                .then(() => 
                  this.setState({
                    lat: 41.067841, 
                    long: 29.045258
                  })
                )
              }}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                AsyncStorage.setItem('location', JSON.stringify({
                  lat: -33.866174, 
                  long: 151.220345
                }))
                .then(() => 
                  this.setState({
                    lat: -33.866174, 
                    long: 151.220345
                  })
                )
              }}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                AsyncStorage.setItem('location', JSON.stringify ({
                  lat:  22.294074, 
                  long: 114.171995
                }))
                .then(() => {
                  this.setState({
                    lat:  22.294074, 
                    long: 114.171995
                  })
                })
              }}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => this.currentLocation()}
        >
            <Text>Current location</Text>
        </TouchableOpacity>
        <MapView style={{flex: 7}} 
          region={{
            latitude: this.state.lat, 
            longitude: this.state.long, 
            latitudeDelta: 0.5, 
            longitudeDelta: 0.25
          }}
        />
      </View>
    );
  }
}

export default App;

// export default class App2 extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
