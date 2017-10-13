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
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('region')
      .then( (regionJSON) => {
        const lastRegion = JSON.parse(regionJSON);
        this.setState({
          region: lastRegion,
        });
        console.log('Initialized region to ', this.state.region);
        console.log(this.state.initialized);
      } )
      .catch( err => { console.log(err) });
  }

  onRegionChange(region) {
    console.log('Post initialized onRegionChange to ', region);
    AsyncStorage.setItem('region', JSON.stringify(region))
      .then( () => {
        this.setState( { region } );
      } );
  }

  changeRegion(lat, long) {
    this.setState( (prevState) => ({
      region: Object.assign({}, prevState.region, {
        latitude: lat,
        longitude: long,
      }),
    }) );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => this.changeRegion(41.067841, 29.045258)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.changeRegion(-33.866174, 151.220345)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.changeRegion(22.294074, 114.171995)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigator.geolocation.getCurrentPosition(
                (success) => { this.changeRegion(
                  success.coords.latitude,
                  success.coords.longitude) },
                (error) => {
                  console.log(error);
                },
                {}
              )
            } }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerFull: {
    flex: 1,
  },
});

export default App;
