import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  RefreshControl,
  Button
} from 'react-native';
// import {Container, List, Content, ListItem} from 'native-base';
import { StackNavigator } from 'react-navigation';


class Messages extends React.Component {
    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {refreshing: false, dataSource: ds.cloneWithRows([])}
        this.getMessages();
    }
    static navigationOptions = {
        title: 'Messages'
    };

    getMessages() {
        fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
           if(responseJson.success){
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
              this.setState({refreshing: false, dataSource: ds.cloneWithRows(responseJson.messages)});
           }else{
               alert(responseJson.error);
               console.log('error in get messages', responseJson.error);
           }
        })
        .catch((err) => {
            console.log('caught error in catch of get messages', err);
        });
    }

    _onRefresh() {
        console.log('ON REFRESH CALLED');
        this.setState({refreshing: true});
        this.getMessages();
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => {return (
                        <View style={styles.message}>
                            <Text>To: {rowData.to.username}</Text>
                            <Text>From: {rowData.from.username}</Text>
                            <Text>Message: {rowData.body}</Text>
                            <Text>When: {rowData.timestamp}</Text>
                        </View>
                    )}
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />}
                ></ListView>
            </View>

        )
    }

}

class UsersScreen extends React.Component {

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {dataSource: ds.cloneWithRows([]), refreshing: false}
        this.getUsers(ds);
    }

    static navigationOptions = ({navigation}) => ({
    // static navigationOptions = (props) => ({
        title: 'Users',
        headerRight: <Button title='Messages' onPress={() => navigation.state.params.onRightPress()}>
            {/* headerRight: <Button title='Messages' onPress={() => props.navigation.navigate('Messages')}> */}
        </Button>
});

    componentDidMount() {
        this.props.navigation.setParams({
            onRightPress: () => this.messages()
        })
    }

  messages() {
      this.props.navigation.navigate('Messages')
  }
  getUsers(){
      fetch('https://hohoho-backend.herokuapp.com/users', {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.success){
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
            this.setState({refreshing: false, dataSource: ds.cloneWithRows(responseJson.users)});
         }else{
             alert(responseJson.error);
             console.log('error in get users', responseJson.error);
            this.setState({refreshing: false});
         }
      })
      .catch((err) => {
          console.log('caught error in catch', err);
      });

  }

  touchUser(user) {
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id
        })
      })
      .then( (response) => response.json())
      .then( (responseJson) => {
          if(responseJson.success){
              Alert.alert('Success', `Your Ho Ho Ho to ${user.username} has been sent!`, [{text: 'Dismiss Button'}])
          } else{
              Alert.alert('Uh oh', `Your Ho Ho Ho to ${user.username} coudl nto be sent!`, [{text: 'Dismiss Button'}])
          }
      })
      .catch((err) => {
          console.log('error in touchuser', err);
          alert(err);
        /* do something if there was an error with fetching */
      });
  }

  _onRefresh() {
      console.log('ON REFRESH CALLED');
      this.setState({refreshing: true});
      this.getUsers();
  }
  render() {
      return (
          <View style={{flex: 1}}>
              <ListView
                  dataSource={this.state.dataSource}
                  renderRow={(rowData) => {return (
                      <TouchableOpacity onPress={this.touchUser.bind(this,rowData)}>
                          <Text style={styles.row}>{rowData.username}</Text>
                      </TouchableOpacity>
                  )}
                  }
                  refreshControl={
                      <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                          tintColor="#ff0000"
                          title="Loading..."
                          titleColor="#00ff00"
                          colors={['#ff0000', '#00ff00', '#0000ff']}
                          progressBackgroundColor="#ffff00"
                      />}
              ></ListView>
          </View>
      )
  }
}
//Screens
class LoginScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {error: '', username: '', password: ''}
    }
  static navigationOptions = {
    title: 'Login'
  };

  press(username, password) {
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.success){
             return this.props.navigation.navigate('Users');
         }else{
             alert(responseJson.error);
             console.log('error in fetchlogin', responseJson.error);
             this.setState({error: responseJson.error});
         }
      })
      .catch((err) => {
          console.log('caught error in catch of login', err);
          alert(err)
        /* do something if there was an error with fetching */
      });

  }
  register() {
    this.props.navigation.navigate('Register');
  }
  setUsername(text){
      this.setState(Object.assign({}, this.state, {username: text}));
  }

  setPassword(text){
      this.setState(Object.assign({}, this.state, {password: text}))
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={{alignSelf: 'flex-start'}}>{this.state.error}</Text>
          <Text style={styles.textBig}>Login to HoHoHo!</Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              placeholder="Username"
              onChangeText={(text) => this.setUsername(text)}
          ></TextInput>

          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              placeholder="Password"
              onChangeText={(text) => this.setPassword(text)}
              secureTextEntry={true}
          ></TextInput>
          <TouchableOpacity onPress={ () => {this.press(this.state.username, this.state.password)} } style={[styles.button, styles.buttonGreen]}>
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
    constructor(props){
        super(props);
        this.state = {username: '', password: ''};
    }
  static navigationOptions = {
    title: 'Register'
  };

  setUsername(text){
      let update = Object.assign({}, this.state, {username: text})
      if(text.length > 0 ){
          this.setState(update)
      } else {
          alert('Username must be entered')
      }
  }

  setPassword(text){
      let update = Object.assign({}, this.state, {password: text})
      if(text.length > 0 ){
          this.setState(update)
      } else {
          alert('Password must be entered')
      }
  }

  submit(password, username){
    //   const username = this.state.username;
    //   const password = this.state.password;
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
         if(responseJson.success){
             return this.props.navigation.goBack();
         }else{
             alert(responseJson.error)
             console.log('THERE WAS AN ERROR', responseJson.error);
         }
      })
      .catch((err) => {
          console.log('caught error in catch');
          alert(err)
        /* do something if there was an error with fetching */
      });
  }
  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.textBig}>Register</Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              placeholder="Username"
              onChangeText={(text) => this.setUsername(text)}
          ></TextInput>

          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              placeholder="Password"
              onChangeText={(text) => this.setPassword(text)}
              secureTextEntry={true}
          ></TextInput>

          <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.submit(this.state.password,this.state.username)} }>
              <Text style={styles.buttonLabel}>Register</Text>
          </TouchableOpacity>
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
      screen: UsersScreen
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
  inputField: {
      marginLeft: 10,
      marginRight: 10
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  row: {
      flex: 1,
      padding: 10,
      borderColor: 'black',
      borderWidth: 1,
      alignSelf: 'stretch'
  },
  message: {
      flex: 1,
      padding: 10,
      borderColor: 'black',
      borderWidth: 1,
      alignSelf: 'stretch'
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
