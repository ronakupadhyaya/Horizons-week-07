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
    super(props)
    AsyncStorage.setItem('region', JSON.stringify({
      latitude: 46.581413,
      longitude: 21.119803,
      latitudeDelta: 0.025,
      longitude: 0.0125
    }))
    this.state = {
      region: {
        latitude: 46.581413,
        longitude: 21.119803,
        latitudeDelta: 0.025,
        longitude: 0.0125
      }
    }
  }

  getInitialState() {
    return {
      region: {
        latitude: 41.067841,
        longitude: 29.045258,
        latitudeDelta: 0.5,
        longitudeDelta: 0.25
      },
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('location')
    .then((result) => {
      this.setState({region: JSON.parse(result)})
    })
  }

  onRegionChange(region) {
    if (region === 'Istanbul') {
      this.setState({
        region: {
          latitude: 41.067841,
          longitude: 29.045258,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        }
      });
    }
    else if (region === 'Sydney') {
      this.setState({
        region: {
          latitude: -33.866174,
          longitude: 151.220345,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        }
      });
    }
    else if (region === 'Hong Kong') {
      this.setState({
        region: {
          latitude: -22.294074,
          longitude: 114.171995,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        }
      });
    }
    else if (region === 'Here') {
      navigator.geolocation.getCurrentPosition(
        (success) => {
          this.setState({
            region: {
              latitude: success.coords.latitude,
              longitude: success.coords.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.25
            }
          });
        },
        (error) => {
          console.log('ERROR', error);
        },
        {}
      )
    }
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.onRegionChange('Istanbul')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onRegionChange('Sydney')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onRegionChange('Hong Kong')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onRegionChange('Here')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          initialRegion={{
            latitude: 41.067841,
            longitude: 29.045258,
            latitudeDelta: 0.5,
            longitudeDelta: 0.25
          }}
          region={this.state.region}
          onRegionChange={(region) =>
            AsyncStorage.setItem('location', JSON.stringify(region))
          }
        />
      </View>
    );
  }
}

export default App;
