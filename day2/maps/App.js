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
    this.state={ region: {
    latitude: 38.850931,
    longitude: -77.456552,
    latitudeDelta: 0.25,
    longitudeDelta: 0.25
  }}
  }

  changeLocation(latitude, longitude) {
    this.setState({
      region: {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.25
    }
    })
  }

  componentDidMount() {
    AsyncStorage.getItem('newRegion')
    .then((result)=> {
      this.setState({
        region: JSON.parse(result)
      })
    })
  }

  onRegionChange(region) {
    this.setState({region: region})
    AsyncStorage.setItem('newRegion', JSON.stringify(region))
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
              onPress={()=> this.changeLocation(41.014120, 28.952296)}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={()=> this.changeLocation(-33.868454, 151.218959)}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={()=> this.changeLocation(22.281007, 114.182122)}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={()=> {
                navigator.geolocation.getCurrentPosition(
                  (success) => {
                    this.setState({ region: {
                      latitude: success.coords.latitude,
                      longitude: success.coords.longitude
                    }
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
        <MapView style={{flex: 7}}
          region={this.state.region} onRegionChange={this.onRegionChange.bind(this)}
        />
      </View>
    );
  }
}

export default App;
