import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Dimensions
} from 'react-native'

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
// This is the root view
var hohoho = React.createClass({
  render() {
    return (
      <NavigatorIOS
      initialRoute={{
        component: Login,
        title: "Login"
      }}
      style={{flex: 1}}
      />
      );
  }
});

var Register = React.createClass({
  register() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      console.log(responseJson.success);
      if (responseJson.success) {
        this.props.navigator.pop();
      }

  /* do something with responseJson and go back to the Login view but
  * make sure to check for responseJson.success! */
})
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err);
    });
  },
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Register</Text>
      <View style={{width: width*.8, borderColor: 'gray', borderWidth: 1}}>
      <TextInput
      style={{marginLeft: 10, height: 40}}
      placeholder="Enter your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      </View>
      <View style={{width: width*.8, borderColor: 'gray', borderWidth: 1}}>
      <TextInput
      style={{marginLeft: 10, height: 40}}
      placeholder="Enter your password"
      onChangeText={(text) => this.setState({password: text})}
      />
      </View>

      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
      <Text style={styles.buttonLabel}>Tap to Register</Text>
      </TouchableOpacity>
      </View>
      );
  }
});

var Login = React.createClass({
  getInitialState() {
    return {message: null}
  },
  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      console.log(responseJson.success);
      if (responseJson.success) {
        this.props.navigator.push({
          component: Users,
          title: "Users"
        })
      }

  /* do something with responseJson and go back to the Login view but
  * make sure to check for responseJson.success! */
})
    .catch((err) => this.setState({message: err})) 
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  },
  render() {
    var arr = []
    if (this.state.message) {
     arr.push(<Text>{this.state.message}</Text>)
   }

   return (
    <View style={styles.container}>
    {arr}
    <Text style={styles.textBig}>Login to HoHoHo!</Text>
    <View style={{width: width*.8, borderColor: 'gray', borderWidth: 1}}>
    <TextInput
    style={{marginLeft: 10, height: 40}}
    placeholder="Enter your username"
    onChangeText={(text) => this.setState({username: text})}
    />
    </View>
    <View style={{width: width*.8, borderColor: 'gray', borderWidth: 1}}>
    <TextInput
    style={{marginLeft: 10, height: 40}}
    placeholder="Enter your password"
    onChangeText={(text) => this.setState({password: text})}
    />
    </View>

    <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
    <Text style={styles.buttonLabel}>Tap to Login</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
    <Text style={styles.buttonLabel}>Tap to Register</Text>
    </TouchableOpacity>
    </View>
    );
 }
});

var Users =  React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //   return {
    //      dataSource: ds.cloneWithRows([
    //     'Moose', 'Lane', 'Josh', 'Ethan', 'Elon', 'Darwish', 'Abhi Fitness'
    //   ])   
    //   };

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      console.log(responseJson.success);
       
      if (responseJson.success) {
       
      this.setState({
           dataSource: ds.cloneWithRows(responseJson.users)
         })
      }
  });
    return {
         dataSource: ds.cloneWithRows([])
      }
  },
  render() {
    return (
      <View style={styles.container}>
      <ListView style={{width: width*.8}}
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <Text>{rowData.username}</Text>}
      />
      </View>
      )

  }

})
const styles = StyleSheet.create({
  container: {
    flex: .8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'center', 
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    width: width*.8
  },
  buttonRed: {
    backgroundColor: '#FF585B', 
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});

AppRegistry.registerComponent('hohoho', () => hohoho );