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
  constructor() {
    super()
    this.state = {
      map: <MapView style={{flex: 7}}
        initialRegion={{
          latitude: 41.008238,
          longitude: 28.978359,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
      />
    }
  }
  istanbul() {
    this.setState({map: <MapView style={{flex: 7}}
      initialRegion={{
        latitude: 41.008238,
        longitude: 28.978359,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      }}
    />})
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
              justifyContent: 'center'}} onPress={this.istanbul()}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
        </View>
        {this.state.map}
      </View>
    );
  }
}

export default App;
