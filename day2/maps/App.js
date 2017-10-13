import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: 40,
      lon: -81,
      latD: 0.05,
      lonD: 0.025
    }
  }

  componentDidMount() {
    console.log("DID MOUNT CALLED");
    AsyncStorage.getItem('region')
      .then((region) => {
        console.log("MOUNT", region);
        region = JSON.parse(region)
        this.setState({
          lat: region.latitude,
          lon: region.longitude,
          latD: region.latitudeDelta,
          lonD: region.longitudeDelta
        })
      })
  }
  changeLoc(order) {
    const latList = [41.067841,-33.866174,22.294074]
    const lonList = [29.045258,151.220345,114.171995]
    this.setState({
      lat: latList[order],
      lon: lonList[order]
    })
  }
  myLoc() {
    navigator.geolocation.getCurrentPosition(
      (success)=>{
        console.log('SPOT',success.coords.latitude,',',success.coords.longitude)
        this.setState({
          lat: success.coords.latitude,
          lon: success.coords.longitude
        });
      },
      (error)=>{
        alert(error)
      },
      {}
    )
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
              justifyContent: 'center'}} onPress={()=>this.changeLoc(0)}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}} onPress={()=>this.changeLoc(1)}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}} onPress={()=>this.changeLoc(2)}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}} onPress={()=>this.myLoc()}>
            <Text>My Location</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}} region={{
          latitude: this.state.lat,
          longitude: this.state.lon,
          latitudeDelta: this.state.latD,
          longitudeDelta: this.state.lonD,
        }} onRegionChangeComplete={(region)=>{
          console.log("REG CHANGE COMP",region);
          AsyncStorage.setItem('region',JSON.stringify(region));
        }}/>
      </View>
    );
  }
}

export default App;
