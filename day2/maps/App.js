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
  constructor(props){
    super(props);
    this.state = {
      latitude: 37.422669,
      longitude: -122.084583,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('latitude').then((result)=>{
      //alert('latitude: ', result);
      this.setState({
        latitude: parseInt(result)
      })
    })
    AsyncStorage.getItem('longitude').then((result)=>{
      //alert('longitude: ', result);
      this.setState({
        longitude: parseInt(result)
      })
    })
  }

  gotoIstanbul(){
    this.setState({
      latitude: 41.067841,
      longitude: 29.045258
    })
    this.storeLocation(this.state.latitude, this.state.longitude);
  }

  gotoSydney(){
    this.setState({
      latitude: -33.866174,
      longitude: 151.220345
    })
    console.log(this.state);
    this.storeLocation(this.state.latitude, this.state.longitude);
  }

  gotoHongKong(){
    this.setState({
      latitude: 22.294074,
      longitude: 114.171995
    })
    this.storeLocation(this.state.latitude, this.state.longitude);
  }

  gotoHere(){
     navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude
        })
      },
      (error) => {
        alert('error in gotoHere():', error)
      },
      {}
    )
  }

  storeLocation(lat, long){
    //alert('in storeLocation:', lat, long);
    AsyncStorage.setItem('latitude', JSON.stringify(lat))
    .then(()=>(AsyncStorage.setItem('longitude', JSON.stringify(long))))
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
            onPress={()=>(this.gotoIstanbul())}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={()=>(this.gotoSydney())}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={()=>(this.gotoHongKong())}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={()=>(this.gotoHere())}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
        region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
        }}/>
      </View>
    );
  }
}

export default App;
