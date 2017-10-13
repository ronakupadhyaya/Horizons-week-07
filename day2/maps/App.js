import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage
 } from 'react-native';
 import { StackNavigator } from 'react-navigation';

import {
  MapView
} from 'expo';

const locations = {
  "Istanbul": {
    latitude: 41.067841,
    longitude: 29.045258
  },
  "Sydney": {
    latitude: -33.866174,
    longitude: 151.220345
  },
  "Hong_Kong": {
    latitude: 22.294074,
    longitude: 114.171995
  }
};

const defaultLatDelta = 0.0250;
const defaultLonDelta = 0.0125;
const defaultLat = 41.067841;
const defaultLon = 29.045258;

class App extends React.Component {
  static navigationOptions = (props) => ({
	   title: 'Home'
  })
  constructor(props){
    super(props);
    this.state={
      latitude: defaultLat,
      longitude: defaultLon,
      latitudeDelta: defaultLatDelta,
      longitudeDelta: defaultLonDelta
    };
  }

  componentDidMount(){
    AsyncStorage.getItem('location')
    .then((success)=>{
      if(success){
        this.setState(JSON.parse(success));
      }
    })
    .catch((error)=>{
      alert('Error retrieving stored location');
    });
  }

  goTo(city){
    if(locations[city]){
      var newLocation = Object.assign({},locations[city],{latitudeDelta: defaultLatDelta,
      longitudeDelta: defaultLonDelta});
      this.setState(newLocation);
    }
    else{
      navigator.geolocation.getCurrentPosition((success)=>{
        var userLocation = Object.assign({},{latitude: success.coords.latitude, longitude: success.coords.longitude, latitudeDelta: defaultLatDelta,
        longitudeDelta: defaultLonDelta});
        this.setState(userLocation);
      },
      (error)=>{
        alert('Error retrieving user location', error);
      });
    }
  }

  handleRegionChange(region){
    AsyncStorage.setItem('location', JSON.stringify(region))
    .then((success)=>{
      this.setState(region);
    })
    .catch((error)=>{
      alert('Error storing location.');
    });
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={()=>this.goTo('Istanbul')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>this.goTo('Sydney')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>this.goTo('Hong_Kong')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>this.goTo(false)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Me</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
        	region = {{
        		latitude: this.state.latitude,
        		longitude: this.state.longitude,
        		latitudeDelta: this.state.latitudeDelta,
        		longitudeDelta: this.state.longitudeDelta
	        }}
          onRegionChangeComplete={(region)=>this.handleRegionChange(region)}
        />
      </View>
    );
  }
}

const Navigator = StackNavigator({
	Home: {screen: App}
})

export default Navigator;
