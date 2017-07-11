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
  constructor(){
    super();
    this.state = {
      latitude: 12.975373,
      longitude:77.591105,
    }
  }

  istanbul(){
    this.setState({latitude:41.067841, longitude:29.045258})
  }
  sydney(){
    console.log('hit')
    this.setState({latitude:-33.866174, longitude:151.220345})
    console.log(this.state)
  }
  hongKong(){
    this.setState({latitude:22.294074, longitude: 114.171995})
    console.log(this.state);
  }
  myLocation(){
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({latitude:success.coords.latitude, longitude:success.coords.longitude})
      },
      (error) => {
        console.log('could not find your location')
      },
      {}
    )
  }
  componentDidMount(){
    AsyncStorage.getItem('region')
    .then((response) => {
      const resp = JSON.parse(response)
      if(response){
        this.setState({latitude: resp.latitude, longitude: resp.longitude})
      }else{
        console.log('no non on no')
      }
    }
  )
}

  render() {
    return (
      <View style={{
        flex: 1
      }}>
      <View style={{flex: 1, flexDirection: 'row', marginTop:20}}>
        <TouchableOpacity
          style={{flex: 1,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center'}}
            onPress={()=>{this.istanbul()}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {this.sydney()}}>
              <Text>Sydney</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center'}}
                onPress={() => {this.hongKong()}}>
                <Text>Hong Kong</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center'}}
                  onPress={() => {this.myLocation()}}>
                  <Text>My Location</Text>
                </TouchableOpacity>
              </View>
              <MapView style={{flex: 7}}
                // initialRegion={{
                //   latitude:12.975373,
                //   longitude:77.591105
                // }}
                region={{
                  latitude:this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta:1,
                  longitudeDelta:1
                }}
                onRegionChange={(region) =>{
                  AsyncStorage.setItem('region', JSON.stringify(region))
                  // console.log('changed region' , region, this.state)
                }}
              />
            </View>
          );
        }
      }

      export default App;
