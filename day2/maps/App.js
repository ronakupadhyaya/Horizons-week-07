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
      region: {
        latitude: 37.257725,
        longitude: 23.152210,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    }
    // this.explore=this.explore.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  // explore(lat, long){
  //   this.setState({
  //     lat: lat,
  //     long: long
  //   });
  // }

  onRegionChange(region){
    AsyncStorage.setItem('location', JSON.stringify(region))
    .then(() => {
      this.setState({ region });
    })
  }

  componentDidMount(){
    AsyncStorage.getItem('location')
    .then((region) => {
      this.setState({ region: JSON.parse(region) });
    });
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.eachNav}
            onPress={() => {
              this.setState({
                region: {
                  latitude: 51.521627,
                  longitude: -0.157542,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }
              })
            }}>
            <Text>London</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachNav}
            onPress={() => this.setState({
              region: {
                latitude: 6.468474,
                longitude: 3.545385,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }
            })}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachNav}
            onPress={() => this.setState({
              region: {
                latitude: 42.269673,
                longitude: -71.342741,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            })}>
            <Text>Natick</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachNav}
            onPress={() => {
              navigator.geolocation.getCurrentPosition(
                (success) => {
                  this.setState({
                    region: {
                      latitude: success.coords.latitude,
                      longitude: success.coords.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }
                  })
                },
                (error) => {

                },
                {}
              )
            }}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  eachNav : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20
  }
})

export default App;
