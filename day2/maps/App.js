import React from 'react';
import {
  TouchableOpacity,
  AsyncStorage,
  StyleSheet,
  Text,
  View
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor(){
    super();
    this.state=({
      latitude:41.067841,
      longitude:29.045258
    })
    this.Istanbul=this.Istanbul.bind(this);
    this.Sydney=this.Sydney.bind(this);
    this.HongKong=this.HongKong.bind(this);
    this.onRegionChange=this.onRegionChange.bind(this)
  }

  Istanbul(){

    AsyncStorage.setItem('latitude',JSON.stringify(41.067841))
    .then(()=> this.setState({latitude:41.067841}))

    AsyncStorage.setItem('longitude',JSON.stringify(29.045258))
    .then(()=> this.setState({longitude:29.045258}))
  }

  Sydney(){
    this.setState({
      latitude:-33.856094,
      longitude:151.220345
    })
  }

  HongKong(){
    this.setState({
      latitude:22.315856,
      longitude:114.161369
    })
  }

  onRegionChange(region){
    AsyncStorage.setItem('latitude',JSON.stringify(region.latitude))
    AsyncStorage.setItem('longitude',JSON.stringify(region.longitude))
  }

  componentDidMount(){
    AsyncStorage.getItem('latitude')
    .then((result)=>{
      this.setState({latitude:Number(result)})
    })
    AsyncStorage.getItem('longitude')
    .then((result)=>{
      this.setState({longitude:Number(result)})
    })
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.Istanbul}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.Sydney}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.HongKong}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigator.geolocation.getCurrentPosition(
            (success)=>{
              this.setState({latitude:success.coords.latitude, longitude:success.coords.longitude})
            },
            (error)=>{
            },
            {}
          )}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>

        <MapView style={{flex: 7}}
        region={{
          latitude:this.state.latitude,
          longitude:this.state.longitude,
          latitudeDelta:0.5,
          longitudeDelta:0.5
        }}
        onRegionChange={this.onRegionChange}
      />
      </View>
    );
  }
}

export default App;
