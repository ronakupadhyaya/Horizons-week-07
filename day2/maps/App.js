import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import {
  MapView
} from 'expo';

console.disableYellowBox = true;

class MapScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 50,
        longitude: 50,
        latitudeDelta: .05,
        longitudeDelta: .05,
      },
    }
  }

  static navigationOptions = {
    title: 'Maps'
  };

  componentDidMount() {
    AsyncStorage.getItem('location')
    .then( location => {
      this.setState({
        region: JSON.parse(location).region
      })
    })
    .catch( error => {console.log('error in async storage mount: ', error);})
  }

  onRegionChangeComplete(region) {
    AsyncStorage.setItem('location', JSON.stringify({region}))
    .catch( error => {console.log('error in on region change: ', error);})
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
            onPress={ () =>
              this.setState({
                region: {
                  latitude: 41.067841,
                  longitude: 29.045258,
                  latitudeDelta: this.state.region.latitudeDelta,
                  longitudeDelta: this.state.region.longitudeDelta,
                }
              })
            }
            >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={ () =>
              this.setState({
                region: {
                  latitude: 22.294074,
                  longitude: 114.171995,
                  latitudeDelta: this.state.region.latitudeDelta,
                  longitudeDelta: this.state.region.longitudeDelta,
                }
              })
            }
            >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={ () =>
              this.setState({
                region: {
                  latitude: -33.866174,
                  longitude: 151.220345,
                  latitudeDelta: this.state.region.latitudeDelta,
                  longitudeDelta: this.state.region.longitudeDelta,
                }
              })
            }
            >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={ () =>
              navigator.geolocation.getCurrentPosition(
                success => {
                  this.setState({
                    region: {
                      latitude: success.coords.latitude,
                      longitude: success.coords.longitude,
                      longitudeDelta: success.coords.longitudeDelta,
                      latitudeDelta: success.coords.latitudeDelta,
                    }
                  })
                },
                error => {
                  console.log("error: ", error);
                },
                {}
              )
            }
            >
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{flex: 8}}
          region={this.state.region}
          showsUserLocation={true}
          onRegionChangeComplete={ (region) => this.onRegionChangeComplete(region) }
        />
      </View>
    );
  }
}

export default StackNavigator({
  Map: {
    screen: MapScreen,
  },
}, {initialRouteName: 'Map'});
