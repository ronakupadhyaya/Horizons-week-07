/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, NavigatorIOS, Button} from 'react-native';

class Page3 extends Component{
  render(){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 40}}>
          Page 3
        </Text>
      </View>
    );
  }
}

class Page2 extends Component{
  goTo3(){
    this.props.navigator.push({
      component: Page3,
      title: 'Title of Page 3'
    });
  }
  render(){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 40}}>
          Page 2
        </Text>
        <Button title= "Go to Page 3" style={{fontSize: 20}} onPress={this.goTo3.bind(this)}>
        </Button>
      </View>
    );
  }
}


class Page1 extends Component{

  goTo2(){
    this.props.navigator.push({
      component: Page2,
      title: 'Title of Page 2'
    });
  }

  render(){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 40}}>
          Page 1
        </Text>
        <Button title= "Go to Page 2" style={{fontSize: 20}} onPress={this.goTo2.bind(this)}>
        </Button>
      </View>
    );
  }
}


export default class fetchExample extends Component {

  render() {
    return (
      <NavigatorIOS
        ref="nav"
        style={{flex:1}}
        initialRoute={{
          component: Page1,
          title: 'Page 1',
          rightButtonTitle: 'Page 2',
          onRightButtonPress: () => (this.refs.nav.push({
            component: Page2,
            title: 'Title of Page 2',
            rightButtonTitle: 'Page 3',
            onRightButtonPress: () => (this.refs.nav.push({
              component: Page3,
              title: 'Title of Page 3'
            }))
          }))
        }}>

        </NavigatorIOS>
    );
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('fetchExample', () => fetchExample);
