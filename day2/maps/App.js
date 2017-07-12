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
      region: {
        latitude: 37.761146,
        longitude: -122.444475,
        latitudeDelta: 0.125,
        longitudeDelta: 0.125
      }
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('region')
      .then((result) => {
        var reg = JSON.parse(result);
        console.log('got it', reg);


        self.setState({
          region: reg,
        })
      })
  }

  changeCoordinatesInstanbul() {
    this.setState({
      region: {
        latitude: 41.067841,
        longitude: 29.045258,
        latitudeDelta: 0.125,
        longitudeDelta: 0.125
      }
    });
  }

  changeCoordinatesSydney() {
    this.setState({
      region: {
        latitude: -33.866174,
        longitude: 151.220345,
        latitudeDelta: 0.125,
        longitudeDelta: 0.125
      }
    });
  }

  changeCoordinatesHongKong() {
    this.setState({
      region: {
        latitude: 22.294074,
        longitude: 114.171995,
        latitudeDelta: 0.125,
        longitudeDelta: 0.125
      }
    });
  }

  findCurrent() {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          region: {
            latitude: success.coords.latitude,
            longitude: success.coords.longitude,
            latitudeDelta: 0.125,
            longitudeDelta: 0.125
          }
        })
      },
      (error) => {
        console.log(error);
      },
      {}
    )
  }

  onRegionChange(region) {
    console.log(region);
    AsyncStorage.setItem('region', JSON.stringify(region))
      .then(() => {
        //this.setState({region: region})
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
              justifyContent: 'center'}}
            onPress={this.changeCoordinatesInstanbul.bind(this)}
          >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={this.changeCoordinatesSydney.bind(this)}
          >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={this.changeCoordinatesHongKong.bind(this)}
          >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={this.findCurrent.bind(this)}
          >
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
        />
      </View>
    );
  }
}

export default App;
