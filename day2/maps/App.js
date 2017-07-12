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
  constructor(props) {
    super(props);
    this.state = {
      lat: 41.067841,
      long: 29.045258,
    }

    this.onRegionChange = this.onRegionChange.bind(this);
  }


  onRegionChange = (region) => {
    AsyncStorage.setItem('region', JSON.stringify(region))
  }


  componentDidMount() {
    AsyncStorage.getItem('region')
    .then((result) => {
      const res = JSON.parse(result)
      this.setState({
        lat: res.latitude,
        long: res.longitude,
      })
        console.log('state is: ', this.state)
    })
    // AsyncStorage.getItem('region', (err, result) => {
    //   let regionParsed;
    //   if (!result) {
    //     regionParsed = {latitude: 41.067841, longitude: 29.045258}
    //   } else {
    //     regionParsed = JSON.parse(result);
    //   }
    //   console.log(regionParsed);
    //   this.setState({ latitude: regionParsed.latitude, longitude: regionParsed.longitude });
    // });
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
              onPress={() => this.setState({lat: 41.067841, long: 29.045258})}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => this.setState({lat: -33.866174, long: 151.220345})}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => this.setState({lat: 22.294074, long: 114.171995})}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                navigator.geolocation.getCurrentPosition(
                  (success) => {
                    this.setState({
                      lat: success.coords.latitude,
                      long: success.coords.longitude
                    })
                  }
                )
                this.setState({lat: 22.294074, long: 114.171995})}}>
            <Text>Here</Text>
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
