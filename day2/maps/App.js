import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      lat: 41.067841,
      long: 29.045258,
    }
  }

  changeLocation = (location) => {
    console.log(location)
    switch (location) {
      case "Istanbul":
        this.setState({
          lat:41.067841,
          long: 29.045258,
        })
        break;
      case "Sydney":
        this.setState({
          lat: -33.866174,
          long: 151.220345,
        })
        break;
      case "Hong-Kong":
        this.setState({
          lat: 22.294074,
          long: 114.171995,
        })
        break;
      default:
        navigator.geolocation.getCurrentPosition(
          (success) => {
            this.setState({
              lat: success.coords.latitude,
              long: success.coords.longitude,
            });
          },
          (error) => {
            console.log("an error occured retrieving the info")
          },
          {}
        );
    }
  }

onRegionChange = (region) => {
  AsyncStorage.setItem('region', JSON.stringify(region))
}

componentDidMount() {
  console.log('COMPONENT DID MOUNT RAN \n')
  AsyncStorage.getItem('region')
    .then((result) => {
      const res = JSON.parse(result)
      this.setState({
        lat: res.latitude,
        long: res.longitude,
      })
        console.log('state is: ', this.state)
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
              onPress={this.changeLocation.bind(this, "Istanbul")}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={this.changeLocation.bind(this, "Sydney")}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={this.changeLocation.bind(this, "Hong-Kong")}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={this.changeLocation.bind(this, "current loc")}>
            <Text>My location</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
        region={{
          latitude: this.state.lat,
          longitude: this.state.long,
          latitudeDelta: 0.05,
          longitudeDelta: 0.025,
        }}
        onRegionChange={this.onRegionChange.bind(this)}
      />
      </View>
    );
  }
}

export default App;
