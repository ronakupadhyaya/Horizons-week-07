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
        longitude: 28.952338,
        latitude: 41.003423
      }
  };

  componentDidMount () {
    AsyncStorage.getItem('region')
      .then((region)=>{
        const newState = {
          longitude: JSON.parse(region).longitude,
          latitude: JSON.parse(region).latitude
      };
      this.setState(newState);
      console.log("set new state completed!",newState);
    });
  };

  onChangeLocation (cityName) {
    switch (cityName) {
      case 'Istanbul':
        this.setState({
          longitude: 28.952338,
          latitude: 41.003423
        });
        break;
      case 'Hong Kong':
        this.setState({
          longitude: 114.171995,
          latitude: 22.294074
        });
        break;
      case 'Sydney':
          this.setState({
            longitude: 151.220345,
            latitude: -33.866174
          });
        break;
      case 'Here':
        navigator.geolocation.getCurrentPosition(
          (success)=>{
            this.setState({
            longitude: success.coords.longitude,
            latitude: success.coords.latitude
            });
          },
          (error)=>{console.log("ERROR getting current location",error);},
          {}
        );
        break;
      default:
        navigator.geolocation.getCurrentPosition(
          (success)=>{this.setState({
            longitude: success.coords.longitude,
            latitude: success.coords.latitude})},
          (error)=>{console.log("ERROR getting current location",error);},
          {}
        );
    };
  };


  render() {
    AsyncStorage.getItem('region').then((region)=>{console.log(region);});
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={()=>{this.onChangeLocation("Istanbul")}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{this.onChangeLocation("Sydney")}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{this.onChangeLocation("Hong Kong")}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{this.onChangeLocation("Here")}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{flex: 7}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
          onRegionChangeComplete={(region)=>{AsyncStorage.setItem('region',JSON.stringify(region))}}
        />
      </View>
    );
  }
}

export default App;
