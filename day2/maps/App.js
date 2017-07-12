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
        // latitude: 0,
        // latitudeDelta:0.5,
        // longitude:0,
        // longitudeDelta: 0.5
      }
    }
  }
  directIstanbul(){
    this.setState({
      region:{
        latitude:41.067841,
        longitude:29.045258,
        latitudeDelta:0.5,
        ongitudeDelta: 0.5
      }
    })
  }
  directSydney(){
    this.setState({
      region:{
        latitude:-33.866174,
        longitude:151.220345,
        latitudeDelta:0.5,
        ongitudeDelta: 0.5
      }
    })
  }
  directHongKong(){
    this.setState({
      region:{
        latitude:22.294074,
        longitude:114.171995,
        latitudeDelta:0.5,
        ongitudeDelta: 0.5
      }
    })
  }
  componentDidMount(){
    AsyncStorage.getItem('previous')
    .then((prevLocation)=>{
      this.setState({region: JSON.parse(prevLocation)})
      return this.state.region;
    })
    .then(region => {console.log('get region:',region)})
    .catch(error=>{console.log(error)})
  }
  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={()=>this.directIstanbul()}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>this.directSydney()}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>this.directHongKong()}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              navigator.geolocation.getCurrentPosition(
                (success) => {
                  this.setState({
                    lat: success.coords.latitude,
                    long: success.coords.longitude
                  });
                },
                (error) => {
                  console.log('error encounterd:',error);
                },
                {}
              )
            }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={this.state.region}
          onRegionChangeComplete={(region)=>{
            console.log(region)
            console.log(JSON.stringify(region))
            AsyncStorage.setItem('previous',JSON.stringify(region))
            .then(()=>{
              this.setState({region:region})
              return this.state})
            .then((state)=> {console.log("state is set:",state)})
          }}
        />
      </View>
    );
  }
}

export default App;
