import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    console.log("logging in");
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
    .then((response)=>(response.json()))
    .then((json)=>{
      console.log("logging in");
      console.log(json);
      if(json.success){
        this.props.navigation.navigate('Users')
      }else{
        console.log("fuck");
      }
    })
    .catch((error)=>{
      console.log(error);
    })

  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:''
    }
  }

  register(){
    console.log("registering");
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
    .then((response)=>(response.json()))
    .then((json)=>{
      console.log("registering");
      console.log(json);
      if(json.success){
        this.props.navigation.goBack()
      }else{
        console.log("fuck");
      }
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.textBig}>Register</Text> */}
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={this.register.bind(this)}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UserScreen extends React.Component {

  static navigationOptions = (props) => ({
      title: 'Users',
      headerRight: <Button title='Messages' onPress={ () => {props.navigation.navigate('Messages')} } />
    });

  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentWillMount(){
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response)=>(response.json()))
    .then((data)=>{
      console.log("users",data);
      const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});
      this.setState({
        dataSource: ds.cloneWithRows(data.users)
      })
    })
    .catch(error=>{
      console.log(error);
    })
  }

  touchUser(rowData){
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          to:rowData._id
      })
    })
    .then(response=>(response.json()))
    .then((json)=>{
      if(json.success){
        Alert.alert('Success');
      }else{
        console.log("sending error");
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }


  render(){
    console.log("rendering",this.state);
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <TouchableOpacity onPress= {this.touchUser.bind(this,rowData)}>
              <Text>{rowData.username}</Text>
            </TouchableOpacity> }
        />
      </View>
    )
  }
}

class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentWillMount(){
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response)=>(response.json()))
    .then((data)=>{
      console.log("messages",data);
      const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});
      this.setState({
        dataSource: ds.cloneWithRows(data.messages)
      })
    })
    .catch(error=>{
      console.log(error);
    })
  }

  render(){
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
              <View>
                <Text>From : {rowData.from.username}</Text>
                <Text>To : {rowData.to.username}</Text>
                <Text>Time : {rowData.timeStamp}</Text>
              </View>

            }
        />
      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UserScreen
  },
  Messages: {
    screen: Messages
  }
}, {initialRouteName: 'Login'});


//Styles
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
