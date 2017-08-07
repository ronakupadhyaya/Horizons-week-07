import React from 'react';
import {
  TouchableOpacity,
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
    this.state = {
      latitude: 41.010182,
      longitude: 28.968104
    }
  }

  istanbul(){
    console.log('ISTANBUL!');
    this.setState({
      latitude: 41.010182,
      longitude: 28.968104
    })
  }

  sydney(){
    console.log('SYDNEY!');
    this.setState({
      latitude: -33.869070,
      longitude: 151.205887
    })
  }

  hongkong(){
    console.log('Hong Kong!');
    this.setState({
      latitude: 22.270167,
      longitude: 114.193000
    })
  }

  here(){
    console.log('Here!');
    navigator.geolocation.getCurrentPosition(
      (success)=>{
        this.setState({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude
        });
      },
      (error)=>{
        console.log('Error!');
      },
      {}
    )

  }

  changing(e){
    console.log(e.nativeEvent);
  }


  render() {
    console.log('Lat -', this.state.latitude, 'Long -', this.state.longitude);
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.istanbul.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.sydney.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.hongkong.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.here.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>

        </View>
        <MapView style={{flex: 7}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
          }}
          onRegionChange={(e)=>this.changing(e)}
         />
      </View>
    );
  }
}

export default App;
