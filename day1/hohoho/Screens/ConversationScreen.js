import React from 'react';
import {
  View,
  Text,
  ListView,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import {
  MapView,
} from 'expo';
import styles from '../Styles/styles'

class ConversationScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      id: '',
      messages: [],
      refreshing: false,
      latitude: 50,
      longitude: 50,
    }
  }

  static navigationOptions = (props) => ({
    title: 'Messages',
  })

  componentWillMount() {
    AsyncStorage.multiGet(['user', 'conversation'])
    .then(result => {
      const userObj = JSON.parse(result[0][1])
      const conversationObj = JSON.parse(result[1][1])
      this.setState({
        username: userObj.username,
        id: userObj.id,
        partnerId:
          userObj.id === conversationObj.fromId ?
          conversationObj.toId :
          conversationObj.fromId,
        latitude: conversationObj.latitude ? conversationObj.latitude : null,
        longitude: conversationObj.longitude ? conversationObj.longitude : null,
      })
    })
  }

  componentDidMount() {
    this.callMessages()
    .then( (resp) => {
      this.setState({
        messages: resp.messages.filter( message => (
          (message.to._id === this.state.id && message.from._id === this.state.partnerId) ||
          (message.from._id === this.state.id && message.to._id === this.state.partnerId)
        ) ),
      });
    })
    .catch( error => {console.log('error in messages: ', error);})
  }

  _onRefresh() {
    this.setState({
      refreshing: true,
    });
    this.callMessages()
    .then( (resp) => {
      this.setState({
        messages: resp.messages.filter( message => (
          (message.to._id === this.state.id && message.from._id === this.state.partnerId) ||
          (message.from._id === this.state.id && message.to._id === this.state.partnerId)
        ) ),
        refreshing: false,
      });
    })
    .catch( error => {console.log('error in messages: ', error);})
  }

  callMessages() {
    return fetch('https://hohoho-backend.herokuapp.com/messages')
    .then( responseJson => responseJson.json() )
  }

  render() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    return (
      <View style={styles.container}>
        {this.state.latitude && this.state.longitude ?
          <View
            style={[styles.textMessageContainer]}
          >
            <MapView
              style={[styles.mapViewContainer], {'height': 300}}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: .01,
                longitudeDelta: .01,
              }}
              showsUserLocation
            >
              <MapView.Marker
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                title={'Here I am'}
              />
            </MapView>
          </View>
          : null
        }
        <ListView
          style={{alignSelf: 'stretch'}}
          dataSource={ds.cloneWithRows(this.state.messages)}
          renderRow={ (item) => (
            <View
              style={[styles.textMessageContainer]}
            >
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
                }>{'From: ' + item.from.username}</Text>
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
                }>{'To: ' + item.to.username}</Text>
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
                }>{'Message: ' + item.body}</Text>
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
              }>{'Sent at: ' + new Date(item.timestamp).toString().split(' ').slice(0,5).join(' ')}</Text>
            </View>
            ) }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={ () => this._onRefresh() }
            />
          }
        />
      </View>
    )
  }
}

export default ConversationScreen;
