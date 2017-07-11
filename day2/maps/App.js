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
  constructor() {
    super();
    this.state = {
      longitude: 0,
      latitude: 0,
    }
  };

  componentDidMount() {
    AsyncStorage.getItem('longitude')
      .then(result=> {
        this.setState({longitude:parseFloat(result)})
      });
    AsyncStorage.getItem('latitude')
      .then(result => {
        this.setState({latitude:parseFloat(result)})
      })
  }

  changeLocation(region) {
    console.log("changed");
    console.log(region);
    AsyncStorage.setItem('latitude',String(region.latitude))
      .then(() => this.setState(latitude: region.latitude));
    AsyncStorage.setItem('longitude',String(region.longitude))
      .then(() => this.setState(longitude:region.longitude));
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
            onPress={()=>{this.setState({latitude:41.067841,longitude:29.045258})}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={()=>{this.setState({latitude:-33.866174,longitude:151.220345})}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={()=>{this.setState({latitude:22.294074,longitude:114.171995})}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={()=>{
                navigator.geolocation.getCurrentPosition(
                  (success) => {
                    this.setState({
                      latitude: parseFloat(success.coords.latitude),
                      longitude: parseFloat(success.coords.longitude),
                    });
                  },
                  (error) => {
                  },
                  {}
                )
              }}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.25,
            longitudeDelta: 0.25,
          }}
          onRegionChange={this.changeLocation.bind(this)}
          style={{flex: 7}} />
      </View>
    );
  }
}

export default App;
