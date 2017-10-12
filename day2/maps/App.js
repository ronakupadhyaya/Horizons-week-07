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
      lat: 0,
      lon: 0
    }

  }

  componentDidMount(){
    AsyncStorage.getItem('location')
      .then((location) => {
        location = JSON.parse(location);
        console.log("JSONPARSE", location);
        if(location){
          this.setState({
            lat: location.lat,
            lon: location.lon
          })
        } else{
          navigator.geolocation.getCurrentPosition(
            (success) => {
              console.log("SUCCESS", success);
              this.setState({
                lat: success.coords.latitude,
                lon: success.coords.longitude
              })
            }
          )
        }

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
              justifyContent: 'center'}} onPress={() => {

                this.setState({
                  lat: 41.067841,
                  lon: 29.045258
                });
                AsyncStorage.setItem('location', JSON.stringify({
                  lat: 41.067841,
                  lon: 29.045258
                }))
            }}  >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}} onPress={() => {
                this.setState({
                  lat: -33.866174,
                  lon: 151.220345
                });
                AsyncStorage.setItem('location', JSON.stringify({
                  lat: -33.866174,
                  lon: 151.220345
                }))

              }
            }>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}} onPress={() => {
                this.setState({
                  lat: 22.294074,
                  lon: 114.171995
                });

                AsyncStorage.setItem('location', JSON.stringify({
                  lat: 22.294074,
                  lon: 114.171995
                }))
              }
            }>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={{
            latitude: this.state.lat,
            longitude: this.state.lon,
            latitudeDelta: 0.25,
            longitudeDelta: 0.125
          }}
        />
      </View>
    );
  }
}

export default App;
