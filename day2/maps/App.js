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
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.025,
                longitudeDelta: 0.0125
            }
        }
    }

    setCoords(lat,long) {
        const newRegion = {latitude: lat, latitudeDelta: 0.05, longitude: long, longitudeDelta: 0.05};
        AsyncStorage.setItem('region', JSON.stringify(newRegion))
        .then( () => this.setState({region: newRegion}));
    }

    setCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (success) => { this.setCoords(success.coords.latitude, success.coords.longitude)}, (error) => console.log(error), {})
    }

    regionChange(region) {
        //changing region in storage
        AsyncStorage.setItem('region', JSON.stringify(region))
    }

    componentDidMount() {
        AsyncStorage.getItem('region')
        .then( (result) => {
            this.setState({region: JSON.parse(result)})
            console.log('component did mount results ', JSON.parse(result), 'curernt state is now', this.state.region);
        })
    }

  render() {
    return (
      <View style={{flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                  style={{flex: 1,
                      borderWidth: 1,
                      alignItems: 'center',
                  justifyContent: 'center'}}
                  onPress={() => this.setCoords(41.067841, 29.045258)}
              >
                  <Text>Istanbul</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={{flex: 1,
                      borderWidth: 1,
                      alignItems: 'center',
                  justifyContent: 'center'}}
                  onPress={() => this.setCoords(-33.866174, 151.220345)}
              >
                  <Text>Sydney</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={{flex: 1,
                      borderWidth: 1,
                      alignItems: 'center',
                  justifyContent: 'center'}}
                  onPress={() => this.setCoords(22.294074, 114.171995)}
              >
                  <Text>Hong Kong</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={{flex: 1,
                      borderWidth: 1,
                      alignItems: 'center',
                  justifyContent: 'center'}}
                  onPress={() => this.setCurrentLocation()}
              >
                  <Text>Here</Text>
              </TouchableOpacity>
          </View>
          <MapView
              style={{flex: 7}}
              region={this.state.region}
              onRegionChange={(region) => this.regionChange(region)}
          />
      </View>
    );
  }
}

export default App;
