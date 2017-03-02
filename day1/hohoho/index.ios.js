import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  Button,
  ListView,
  AsyncStorage,
  MapView
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  getInitialState(){
    return {
      username: "Toe",
      password: "toe"
    }
  },
  render() {
    return (
      <NavigatorIOS
      initialRoute={{
        component: Login,
        title: "Login",
        passProps: {parent: this}
      }}
      style={{flex: 1}}
      />
    );
  }
});

var Register = React.createClass({
  press(){
    if(this.props.parent.state.username && this.props.parent.state.password){
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.props.parent.state.username,
          password: this.props.parent.state.password
        })
      })
      .then((response)=> response.json())
      .then((responseJson)=> {
        console.log(responseJson);
        if(!responseJson.success){
          alert("This is wrong")
        }else {
          this.props.navigator.pop();
        }
      })
      .catch((err)=> {
        console.log("error", err);
      });
    }
  },
  render() {
    console.log(this.props.parent)
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Register</Text>
      <TextInput
      style={{height: 40}}
      placeholder="Enter your username"
      defaultValue={this.props.parent.state.username}
      onChangeText={(text) => this.props.parent.setState({username: text})}
      />
      <TextInput
      style={{height: 40}}
      placeholder="Enter your password"
      secureTextEntry={true}
      defaultValue={this.props.parent.state.password}
      onChangeText={(text) =>
        {
          console.log(text)
          this.props.parent.setState({password: text})}
        }
        />
        <TouchableOpacity>
        <Button
        title="register"
        style={styles.buttonRed}
        onPress={this.press}
        />
        </TouchableOpacity>
        </View>
      );
    }
  });

  var Messages = React.createClass({
    getInitialState(){
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});
      return{
        dataSource: ds.cloneWithRows([])
      }
    },
    componentDidMount(){
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'GET'
      })
      .then((res) => res.json())
      .then((responseJson)=> {
        if(!responseJson.success){
          alert("This is wrong")
        }else {
          console.log("peace and unity",responseJson)
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseJson.messages)
          })
        }
      })
      .catch((err)=> {
        console.log("error", err);
      });
    },
    render() {
      return (
        <View>
        <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>  (
          <View>
          <Text>From {rowData.from.username}</Text>
          <Text>To {rowData.to.username}</Text>
          <Text>Message {rowData.body}</Text>
          {(rowData.hasOwnProperty("location"))?
          <MapView
           style={{width: 400, height: 150, margin: 40, alignItems: 'center'}}
           scrollEnabled={true}
           region={{
             latitude: rowData.location.latitude,
             longitude: rowData.location.longitude,
             longitudeDelta: 1,
             latitudeDelta: 1
           }}
           annotations={[{
             latitude: rowData.location.latitude,
             longitude: rowData.location.longitude,
             title: "Pinged Location"
           }]}
         />
            : null}
          <Text>When {rowData.timestamp}</Text>
          </View>
        )}
        />
        </View>
      );
    }
  })


  var Users = React.createClass({
    press(rowData){
      console.log(rowData);
    },
    getInitialState(){
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return{
        dataSource: ds.cloneWithRows([])
      }
    },
    componentDidMount(){
      var arr=[]
      fetch('https://hohoho-backend.herokuapp.com/users', {
        method: 'GET'
      })
      .then((response)=> response.json())
      .then((txt)=> {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(txt.users)
        })
      })
      .catch((err)=>console.log('err', err))
    },
    touchUser(rowData){
      console.log("don't touch your users bennit")
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method:'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: rowData._id
        })
      })
      .then((resp)=> (resp.json()))
      .then((responseJson)=>{
        console.log(responseJson)
        if(!responseJson.success){
          alert("This is wrong")
        } else {
          alert("Your HO HO HO! has been sent to "+rowData.username)
        }
      })
      .catch((err)=>console.log("err",err))
    },

    button(){
      this.props.navigator.push({
        component: Messages,
        title: "Message",
        passProps: {parent: this.props.parent}
    })
  },

  sendLocation(rowData){
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Got position:", position);
        fetch('https://hohoho-backend.herokuapp.com/messages',{
          method:'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: rowData._id,
            location: {
              longitude: position.coords.longitude, latitude: position.coords.latitude
            }
          })
        })
        .then((resp)=> {
          console.log(resp)
          return resp.json()
        })
        .then((responseJson)=>{
          console.log(responseJson)
          if(!responseJson.success){
            alert("This is wrong")
          } else {
            alert("Your HO HO HO! has been sent to "+rowData.username)
          }
        })
        .catch((err)=>console.log("err",err))
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },

    render() {
      return(
        <View style={{flex:1, marginTop: 69}}>
          <Button title= "Message" onPress={this.button} />
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>  (
              <TouchableOpacity
                onPress={this.touchUser.bind(this, rowData)}
                onLongPress={this.sendLocation.bind(this, rowData)}
                delayLongPress={500}>
                  <Text style={{borderColor: "black", borderWidth: 2}}>{rowData.username}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )
    }
  })

  var Login = React.createClass({
    componentDidMount() {
      AsyncStorage.getItem('user')
        .then((result) => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.press(username,password)
        }
    });
  },
    press(username,password) {
      var myusername = (typeof username !== 'string' ? this.props.parent.state.username : username)
      var mypassword = (typeof password !== 'string' ? this.props.parent.state.password : password)
      console.log("fuck",username,password)
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: myusername,
          password: mypassword
        })
      })
      .then((response)=> response.json())
      .then((responseJson)=> {
        console.log(responseJson);
        if(!responseJson.success){
          if(this.props.parent.state.username===""&&this.props.parent.state.password===""){
            console.log("nothing entered yet")
          } else {
            alert("Wrong login credentials")
          }
        }else {
          AsyncStorage.setItem('user', JSON.stringify({
            username: this.props.parent.state.username,
            password: this.props.parent.state.password
          }));
          this.props.navigator.push({
            component: Users,
            title: "Users",
            passProps: {parent: this.props.parent}
          })
        }
      })

      .catch((err)=>console.log("err",err))
    },
    register() {
      this.props.navigator.push({
        component: Register,
        title: "Register",
        passProps: {parent: this.props.parent}
      });
    },
    render() {
      return (
        <View style={styles.container}>
          <TextInput
            style={{height: 40}}
            placeholder="username"
            defaultValue={this.props.parent.state.username}
            onChangeText={(text) => this.props.parent.setState({username: text})}
            />
          <TextInput
            style={{height: 40}}
            placeholder="password"
            secureTextEntry={true}
            defaultValue={this.props.parent.state.password}
            onChangeText={(text) => this.props.parent.setState({password: text})}
          />
          <Text style={styles.textBig}>Login to HoHoHo!</Text>
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
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
      alignSelf: 'stretch',
      paddingTop: 10,
      paddingBottom: 10,
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
      borderRadius: 5
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
