import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../style/styles';
import { Location, Permissions } from 'expo';
const SERVER_URL = "https://hohoho-backend.herokuapp.com";

class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  constructor(props){
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  messages(){
    this.props.navigation.navigate('Messages');
  }

  componentDidMount(){
    fetch(`${SERVER_URL}/users`,{
      method: 'GET'
    })
    .then((resp)=>(
      resp.json()
    ))
    .then((respJson)=>{
      if(!respJson.success){
        throw('Error');
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(respJson.users)
      });
    })
    .catch((err)=>{
      alert('Error loading friends.');
    });

    this.props.navigation.setParams({
      onRightPress: ()=>(this.messages())
    });
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted'){
      alert('Enable location sharing in settings.');
    }
    else{
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.touchUser(user,location.coords);
    }
  }

  touchUser(user, coords){
    fetch(`${SERVER_URL}/messages`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: (coords ? coords.longitude : false),
          latitude: (coords ? coords.latitude : false)
        }
      })
    })
    .then((resp)=>(
      resp.json()
    ))
    .then((respJson)=>{
      var message = `Your 'Ho Ho Ho!' to ${user.username} `;
      if(respJson.success){
        message += 'has been sent.';
      }
      else{
        message += 'cound not be sent.';
      }
      alert(message);
    })
    .catch((err)=>{
      alert(`Your 'Ho Ho Ho!' to ${user.username} could not be sent.`);
    })
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <TouchableOpacity
            key={rowData._id}
            onPress={()=>this.touchUser(rowData)}
            onLongPress={()=>this.sendLocation(rowData)}
            delayLongPress={1000}
          >
            <Text
            style={{fontSize: 20}}
            >
              {rowData.username}
            </Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

export default UserScreen;
