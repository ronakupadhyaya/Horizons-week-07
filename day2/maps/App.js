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
  constructor(props){
    super(props)

    AsyncStorage.setItem('region', JSON.stringify({
      latitude: 41.033788,
      longitude: 28.974438,
      latitudeDelta: 0.5,
      longitudeDelta: 0.25
    }))

    this.state = {
      region: {
        latitude: 41.033788,
        longitude: 28.974438,
        latitudeDelta: 0.5,
        longitudeDelta: 0.25
      }
    }

  }

  componentDidMount(){
    AsyncStorage.getItem('region')
    .then((result) => {
      console.log(JSON.parse(result))
      this.setState({region: JSON.parse(result)})
    })
  }



  onRegionChange(region){
    if(region === 'Istanbul'){
      AsyncStorage.setItem('region', JSON.stringify({
        latitude: 41.033788,
        longitude: 28.974438,
        latitudeDelta: 0.5,
        longitudeDelta: 0.25
      }))
      this.setState({
        region: {
          latitude: 41.033788,
          longitude: 28.974438,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        }
      })

    }else if(region === 'Sydney'){

      AsyncStorage.setItem('region', JSON.stringify({
        latitude: -33.866174,
        longitude: 151.220345,
        latitudeDelta: 0.5,
        longitudeDelta: 0.25
      }))

      this.setState({
        region: {
          latitude: -33.866174,
          longitude: 151.220345,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        }
      })

    }else if(region === 'HongKong'){
      AsyncStorage.setItem('region', JSON.stringify({
        latitude: 22.294074,
        longitude: 114.171995,
        latitudeDelta: 0.5,
        longitudeDelta: 0.25
      }))

      this.setState({
        region: {
          latitude: 22.294074,
          longitude: 114.171995,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        }
      })

    }else if(region === 'HERE'){
      navigator.geolocation.getCurrentPosition(
        (success) => {
          this.setState({
            region:{
              latitude: success.coords.latitude,
              longitude: success.coords.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.25
            }
          })

          AsyncStorage.setItem('region', JSON.stringify({
            latitude: success.coords.latitude,
            longitude: success.coords.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.25
          }))

        },
        (error) => {
          console.log(error)
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
        <View style={{marginTop: 20, flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.onRegionChange('Istanbul')}
              >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.onRegionChange('Sydney')}
              >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.onRegionChange('HongKong')}
              >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress = {() => this.onRegionChange('HERE')}
              >
              <Text>HERE</Text>
          </TouchableOpacity>
        </View>

        <MapView style={{flex: 7}}
            region={this.state.region}
            onRegionChange={(region) => {
                console.log(region)
                AsyncStorage.setItem('region', JSON.stringify(region))
                this.setState({
                  region: region
                })
              }
            }
        />


      </View>
    );
  }
}

export default App;
