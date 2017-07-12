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
      turkeyCoords: {
        latitude: 41.032956,
        longitude: 28.928372,
        latitudeDelta: 0.1,
        longitudeDelta: 0.5
      },
      sydneyCoords: {
        latitude: -33.815984,
        longitude: 151.180504,
        latitudeDelta: 0.1,
        longitudeDelta: 0.5
      },
      hkCoords: {
        latitude: 22.253389,
        longitude: 114.189454,
        latitudeDelta: 0.1,
        longitudeDelta: 0.5
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.1,
        longitudeDelta: 0.5
      }
    }
  }


  componentDidMount() {
    const self = this;
    AsyncStorage.getItem('region')
    .then(region => {
      console.log('region on didmount', JSON.parse(region));
      self.setState({region: JSON.parse(region)});
    })
    .catch(err =>{
      console.log('err', err);
    })
  }

  onRegionChange(region) {
    const self = this;
    console.log('region', region);
    // console.log('self', self.state.region);
    AsyncStorage.setItem('region', JSON.stringify(region))
    // .then(() => {
    //   console.log('region in onRegionChange', region);
    //   self.setState({region})
    // })
    // .catch(err => {
    //   console.log('err in region change', err);
    // });
  }

  setCoord(region){
    console.log('region on set coord', region);
    this.setState({
      region: region
    });
    this.onRegionChange(region);
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
            onPress={() => {
              this.setCoord(this.state.turkeyCoords)
            }}
          >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => {
              this.setCoord(this.state.sydneyCoords)
            }}
          >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => {
              this.setCoord(this.state.hkCoords)
            }}
          >
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
                      region: {
                        latitude: success.coords.latitude,
                        longitude: success.coords.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.5
                      }
                    });
                  },
                  (error) => {
                    console.log('error in geo', error);
                  },
                  {}
                )
              }}
            >
            <Text>Current</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{flex: 7}}
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
         />
      </View>
    );
  }
}

export default App;
