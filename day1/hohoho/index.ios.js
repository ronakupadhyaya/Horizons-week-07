
import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  NavigatorIOS,
  AlertIOS,
  ListView,
  Alert,
  Image,
  ImagePickerIOS
} from 'react-native'

var _ = require('underscore');

var PIECES = {
  'F':	1,
  'B':	2,
  'S':	1,
  '2':	4,
  '3':	2,
  '4':	2,
  '5':	3,
  '6':	2,
  '7':	2,
  '8':	2,
  '9':	2,
  '10': 1
}

// This is the root view
var hohoho = React.createClass({
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Stratizons,
          title: "Stratizons"
        }}
        style={{flex: 1}}
      />
    );
  }
});

var Rules = React.createClass({
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Register Below</Text>
      <TextInput
      style={{
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      placeholder="Set your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
      style={{
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      placeholder="Set your password"
      onChangeText={(text) => this.setState({password: text})}
      />
      <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonBlue]}>
      <Text style={styles.buttonLabel}>Tap to Register</Text>
      </TouchableOpacity>
      </View>
    );
  }
});

var GamePage = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var createPieces = () => {
      var pieces = [];
      _.forEach(PIECES, (value, key) => {
        for (var i = 0; i < value; i++) {
          pieces.push({
            piece: key,
            team: 'red',
            oldPos:{},
            newPos:{}
          });
        }
      });
      return pieces;
    }

    return {
      dataSource: ds.cloneWithRows([]),
      data: [],
      pieces: createPieces(),
      isStarted: false,
      currentPlayer: 'red'
    };
  },
  _pressData: ({}: {[key: number]: boolean}),
  componentWillMount: function() {
    this._pressData = {};
  },
  componentDidMount: function() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._genRows({})),
    })
  },
  _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
    var dataBlob = [];

    for (var ii = 0; ii < 8; ii++) {
      var row = [];
      for (var ij = 0; ij < 8; ij++) {
        row.push('');
      }

      dataBlob.push(row);
      this.setState({data: dataBlob})
    }
    // for (var ii = 0; ii < 64; ii++) {
    //   var pressedText = pressData[ii] ? ' (X)' : '';
    //   dataBlob.push(ii + pressedText);
    // }
    return dataBlob;
  },
  _pressRow: function(colID: number, rowID: number) {
    var row = parseInt(rowID), col = parseInt(colID);
    console.log('original ' +colID + 'col' + rowID);
    if (5 <= row && row <= 7) {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var newState = Object.assign({}, this.state);

      if (!newState.data[col][row]) {
        var thisPiece = newState.pieces[newState.pieces.length - 1];
        console.log(thisPiece);

      if (thisPiece.newPos === {}){
          thisPiece.newPos.row = row;
          thisPiece.newPos.col = col;
      }
      else{
          thisPiece.oldPos.row = thisPiece.newPos.row;
          thisPiece.oldPos.col = thisPiece.newPos.col;
          thisPiece.newPos.row = row;
          thisPiece.newPos.col = col;

          //send this shit to the backend
        }
        newState.data[col][row] = thisPiece;
        console.log("old: "+ thisPiece.oldPos + ' and ' + "new: "+ thisPiece.newPos);
        newState.dataSource = ds.cloneWithRows(newState.data);
        newState.pieces.pop();
      } else {
        newState.pieces.push(newState.data[col][row]);
        newState.data[col][row] = '';
        newState.dataSource = ds.cloneWithRows(newState.data);
      }
      //fetch("placeholder", {
     //     method:'POST',
     //     headers:{
     //       "Content-Type": "application/json"
     //     }}).then((resp) => resp.json())
     //     .then((json)=> {
     //       if (json.success){
     //
     //       }
     //     })
      this.setState(newState);
    }
  },
  _gameMove: function(colID: number, rowID: number) {
    var row = parseInt(rowID), col = parseInt(colID);

    fetch('https://nameless-falls-19660.herokuapp.com/makemove', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            body: {
              formData
            },
            .then((response) => response.json())
            .then((responseJson) => {
            this.setState({data: responseJson.board, moves: currentPlayer: responseJson.currentPlayer})
            }))
    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // var newState = Object.assign({}, this.state);
    //
    // if (!newState.data[col][row] && !!newState.pieces.length) {
    //   var thisPiece = newState.pieces[newState.pieces.length - 1];
    //   newState.data[col][row] = thisPiece;
    //   newState.dataSource = ds.cloneWithRows(newState.data);
    //   newState.pieces.pop();
    // } else {
    //   if (!newState.pieces.length) {
    //     newState.pieces.push(newState.data[col][row]);
    //     newState.data[col][row] = '';
    //     newState.dataSource = ds.cloneWithRows(newState.data);
    //   } else {
    //     Alert.alert('Cannot make move')
    //   }
    // }
    //
    // this.setState(newState);
  },
  _started: function(){
    console.log(this.state.isStarted);
    this.setState({isStarted: true});

  },
  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    console.log(rowData, sectionID, rowID);
    return (
        <View>
          {typeof rowData === 'object' &&
            rowData.map((rowNumber, i) => (
              // <TouchableHighlight onPress={() => this._pressRow(rowID, i)}
              <TouchableHighlight onPress={this.state.isStarted ? () => this._gameMove(rowID, i) : () => this._pressRow(rowID,i)} underlayColor='rgba(0,0,0,0)'>
                <View>
                  <View style={styles.row}>
                  {!!rowNumber && !!rowNumber.piece &&
                    <Text style={styles.text1}>
                      {(rowNumber.piece)}
                    </Text>
                  }
                  </View>
                </View>
              </TouchableHighlight>
            ))
          }
        </View>
    )
  },
  render() {
    return (
      <View style={styles.container}>
        <ListView contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}


        />
        {!!this.state.pieces.length && <Text style={{fontSize: 100}}>{this.state.pieces[this.state.pieces.length-1].piece}</Text>}

        {!this.state.pieces.length &&
          <TouchableOpacity style={[styles.button, styles.buttonPink]} onPress={this._started}>
          <Text style={styles.buttonLabel}>Finished with Turn</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
})

var Stratizons = React.createClass({
  press() {
    this.props.navigator.push({
      component: GamePage,
      title: "Play Game!",
    })
  },
  rules() {
    this.props.navigator.push({
      component: Rules,
      title: "Rules & Settings "
    });
  },
  connection() {
    this.props.navigator.push({
      component: Rules,
      title: "Connection Codes"
    })
  },

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: 400, height: 400, resizeMode: 'contain'}}
          source={require('./img/Stratizons.png')}></Image>
      <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
      <Text style={styles.buttonLabel}>Tap to Play
      </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonPink]} onPress={this.connection}>
      <Text style={styles.buttonLabel}>Connection Codes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.rules}>
      <Text style={styles.buttonLabel}>Rules & Settings</Text>
      </TouchableOpacity>
      </View>
    );
  }
});



const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 10
  },
  row: {
    justifyContent: 'center',
    width: 44,
    height: 55,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
  },
  thumb: {
    width: 64,
    height: 64
  },
  text: {
    flex: 1,
    marginTop: 5,
    fontWeight: 'bold',
    alignItems: 'right'
  },
  text: {
    flex: 1,
    marginTop: 5,
    fontWeight: 'bold',
    alignItems: 'flex-end'
  },
  item: {
    backgroundColor: '#CCC',
    margin: 1,
    width: 10,
    height: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF2DA',
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
    backgroundColor: '#24248f',
  },
  buttonPink: {
    backgroundColor: '#99004d'
  },
  buttonGreen: {
    backgroundColor: '#008000'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
// const styles = StyleSheet.create({
//   list: {
//     justifyContent: 'center',
//     flexDirection: 'row',
//     flexWrap: 'wrap'
//   },
//   item: {
//     backgroundColor: '#CCC',
//     margin: 1,
//     width: 10,
//     height: 10
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   containerFull: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'stretch',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
//   textBig: {
//     fontSize: 36,
//     textAlign: 'center',
//     margin: 10,
//   },
//   button: {
//     alignSelf: 'stretch',
//     paddingTop: 10,
//     paddingBottom: 10,
//     marginTop: 10,
//     marginLeft: 5,
//     marginRight: 5,
//     borderRadius: 5
//   },
//   buttonRed: {
//     backgroundColor: '#FF585B',
//   },
//   buttonBlue: {
//     backgroundColor: '#0074D9',
//   },
//   buttonPink: {
//     backgroundColor: '#FF585B'
//   },
//   buttonGreen: {
//     backgroundColor: '#2ECC40'
//   },
//   buttonLabel: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: 'white'
//   }
// });

AppRegistry.registerComponent('hohoho', () => hohoho );


//ORIGINAL HOHOHO APPLICATION

// import React, {Component} from 'react'
// import Swiper from 'react-native-swiper'
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   NavigatorIOS,
//   ListView,
//   refreshControl,
//   Alert,
//   AsyncStorage,
//   MapView,
//   Image,
//   ImagePickerIOS
// } from 'react-native'
//
// // This is the root view
//
// // export default class CameraRollPicker extends Component {
// //   constructor() {
// //     super();
// //     this.state = { image: null };
// //   }
// //
// //   componentDidMount() {
// //     this.pickImage();
// //   }
// //
// //   pickImage() {
// //     // openSelectDialog(config, successCallback, errorCallback);
// //     ImagePickerIOS.openSelectDialog({}, imageUri => {
// //       var formData = new FormData();
// //       formData.append('moose', {
// //         uri: this.state.image,
// //         type: 'image/jpeg',
// //         name: 'whatever.jpg'
// //       });
// //       fetch('https://s3-upload.gomix.me/', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'multipart/form-data'
// //         },
// //         body: formData
// //       })
// //     }, error => console.error(error));
// //   }
// //
// //   render() {
// //     return (
// //       <View style={{ flex: 1 }}>
// //       {this.state.image?
// //         <Image style={{ flex: 1 }} source={{ uri: this.state.image }} /> :
// //         null
// //       }
// //       </View>
// //     );
// //   }
// // }
//
// var hohoho = React.createClass({
//   render() {
//     return (
//
//       <NavigatorIOS
//       initialRoute={{
//         component: Login,
//         title: "Main"
//       }}
//       style={{flex: 1}}
//       />
//     );
//   }
// });
// var SwiperView = React.createClass({
//   render() {
//     return (
//       <Swiper style={{marginTop: 30}}>
//       <Users />
//       <Messages />
//       </Swiper>
//     );
//   }
// });
//
// var Register = React.createClass({
//   getInitialState() {
//     return {
//       username: '',
//       password: ''
//     }
//   },
//   register() {
//     fetch('https://hohoho-backend.herokuapp.com/register', {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         username: this.state.username,
//         password: this.state.password,
//       })
//     })
//     .then((response) => response.json())
//     .then((responseJson) => {
//       /* do something with responseJson and go back to the Login view but
//       * make sure to check for responseJson.success! */
//       if (responseJson.success) {
//         this.props.navigator.pop();
//       } else {
//         this.setState({
//           error: responseJson.error
//         })
//       }
//     })
//     .catch((err) => {
//       /* do something if there was an error with fetching */
//       console.log('error', err)
//     });
//   },
//   render() {
//     return (
//       <View style={styles.container}>
//       <TextInput
//       style={{height: 40, borderWidth: 2, paddingTop: 10,
//         paddingBottom: 10,
//         marginTop: 10,
//         marginLeft: 5,
//         marginRight: 5,
//         borderRadius: 5}}
//         placeholder="Enter your username"
//         onChangeText={(text) => this.setState({username: text})}
//         />
//         <TextInput secureTextEntry={true}
//         style={{height: 40, borderWidth: 2, paddingTop: 10,
//           paddingBottom: 10,
//           marginTop: 10,
//           marginLeft: 5,
//           marginRight: 5,
//           borderRadius: 5}}
//           placeholder="Enter your Password"
//           onChangeText={(text) => this.setState({password: text})}
//           />
//           <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={this.register}>
//           <Text style={styles.buttonLabel}>Register</Text>
//           </TouchableOpacity>
//           <Text>{this.state.error}</Text>
//           </View>
//         );
//       }
//     });
//     var LoginPage = React.createClass({
//       getInitialState() {
//         return {
//           username: '',
//           password: ''
//         }
//       },
//       register() {
//         fetch('https://hohoho-backend.herokuapp.com/login', {
//           method: 'POST',
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             username: this.state.username,
//             password: this.state.password
//           })
//         })
//         .then((response) => response.json())
//         .then((responseJson) => {
//           console.log('login responseJson', responseJson)
//           /* do something with responseJson and go back to the Login view but
//           * make sure to check for responseJson.success! */
//           if (responseJson.success){
//             AsyncStorage.setItem('user', JSON.stringify({
//               username: this.state.username,
//               password: this.state.password
//             }));
//             this.props.navigator.push({
//               component: SwiperView,
//               title: "SwipeView",
//               rightButtonTitle: 'Messages',
//               onRightButtonPress: this.messages
//             });
//           } else {
//             this.setState({
//               message: responseJson.error
//             })
//           }
//         })
//         .catch((err) => {
//           /* do something if there was an error with fetching */
//           console.log(err)
//         });
//       },
//       messages(){
//         this.props.navigator.push({
//           component: Messages,
//           title: "Messages"
//         })
//       },
//       render() {
//         return (
//           <View style={styles.container}>
//           <TextInput
//           style={{height: 40, borderWidth: 2, paddingTop: 10,
//             paddingBottom: 10,
//             marginTop: 10,
//             marginLeft: 5,
//             marginRight: 5,
//             borderRadius: 5}}
//             placeholder="Enter your username"
//             onChangeText={(text) => this.setState({username: text})}
//             />
//             <TextInput secureTextEntry={true}
//             style={{height: 40, borderWidth: 2, paddingTop: 10,
//               paddingBottom: 10,
//               marginTop: 10,
//               marginLeft: 5,
//               marginRight: 5,
//               borderRadius: 5}}
//               placeholder="Enter your Password"
//               onChangeText={(text) => this.setState({password: text})}
//               />
//               <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={this.register}>
//               <Text style={styles.buttonLabel}>Login</Text>
//               </TouchableOpacity>
//               <Text>{this.state.error}</Text>
//               </View>
//             );
//           }
//         });
//
//         var Users = React.createClass({
//           getInitialState() {
//             const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//             fetch('https://hohoho-backend.herokuapp.com/users')
//             .then((response) => response.json())
//             .then((responseJson) => {
//               if (responseJson.success){
//                 this.setState({
//                   dataSource: ds.cloneWithRows(
//                     responseJson.users
//                   )});
//                 } else {
//                   console.log('error')
//                 }
//               });
//               return {
//                 dataSource: ds.cloneWithRows([])
//               }
//             },
//             touchUser(user, position){
//               fetch('https://hohoho-backend.herokuapp.com/messages', {
//                 method: 'POST',
//                 headers: {
//                   "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                   to: user._id,
//                   location: {
//                     longitude: position && position.coords && position.coords.longitude ,
//                     latitude: position && position.coords && position.coords.latitude
//                   }
//                 })
//               })
//               .then((response) => response.json())
//               .then((responseJson) => {
//                 if (responseJson.success){
//                   Alert.alert(
//                     'Alert Title',
//                     'Your Ho Ho Ho! to ' + user.username + 'has been sent!',
//                     [{text: 'Dismiss Button'}]
//                   )
//                 } else {
//                   Alert.alert(
//                     'Alert Title',
//                     'Your Ho HO hO! to ' + user.username + 'could not be sent.',
//                     [{text: 'Dismiss Butotn'}]
//                   )
//                 }
//               })
//             },
//             sendLocation(user) {
//               navigator.geolocation.getCurrentPosition(
//                 position => {
//                   console.log("Got position:", position);
//                   this.touchUser(user, position)
//                 },
//                 error => alert(error.message),
//                 {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
//               );
//             },
//             render(){
//               return (
//                 <View style={styles.container}>
//                 <ListView
//                 dataSource={this.state.dataSource}
//                 renderRow={(rowData) => <View style={styles.container}>
//                 <TouchableOpacity
//                 onPress={this.touchUser.bind(this, rowData)}
//                 onLongPress={this.sendLocation.bind(this, rowData)}
//                 delayLongPress={500}>
//
//                 <Text>{rowData.username}</Text></TouchableOpacity>
//                 </View>} />
//                 </View>
//               )
//             }
//           })
//
//           var Messages = React.createClass({
//             messageUpdate(){
//               const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
//               fetch('https://hohoho-backend.herokuapp.com/messages')
//               .then((responseJson) => (responseJson.json()))
//               .then((response) => {
//                 console.log('THIS ONE', response)
//                 if(response.success){
//                   this.setState({
//                     dataSource: ds.cloneWithRows(response.messages)
//                   })
//                 } else {
//                   console.log('error')
//                 }
//               })
//               return {
//                 dataSource: ds.cloneWithRows([])
//               }
//             },
//             getInitialState(){
//               this.messageUpdate;
//               return {
//                 seen: false
//               }
//             },
//
//             componentDidMount(){
//               var refreshMessage = setInterval(this.messageUpdate, 3000);
//             },
//
//             render(){
//               return(
//                 <View>
//                 <ListView
//                 dataSource={this.state.dataSource}
//                 renderRow={(rowData) => <View style={styles.container}>
//                 <Text>From: {rowData.from.username}</Text>
//                 <Text>To: {rowData.to.username}</Text>
//                 <Text>Message: Yo</Text>
//                 <Text>When: {rowData.timestamp}</Text>
//                 {(rowData.location && rowData.location.longitude) ? (
//                   <MapView
//                   style={{flex: 1, height: 200, margin: 0, width: 200}}
//                   showsUserLocation={true}
//                   scrollEnabled={false}
//                   region={{
//                     longitude: rowData.location.longitude,
//                     latitude: rowData.location.latitude,
//                     longitudeDelta: 1,
//                     latitudeDelta: 1
//                   }}
//                   annotations={[{
//                     latitude: rowData.location.latitude,
//                     longitude: rowData.location.longitude,
//                   }]}
//                   />
//                 ) : null}
//                 </View> } />
//                 </View>
//               )
//             }
//           })
//           var Login = React.createClass({
//             login(username, password) {
//               console.log('inner login')
//               fetch('https://hohoho-backend.herokuapp.com/login', {
//                 method: 'POST',
//                 headers: {
//                   "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                   username: username,
//                   password: password
//                 })
//               })
//               .then((response) => response.json())
//               .then((responseJson) => {
//                 /* do something with responseJson and go back to the Login view but
//                 * make sure to check for responseJson.success! */
//                 if (responseJson.success){
//                   this.props.navigator.push({
//                     component: SwiperView,
//                     title: "Users",
//                     rightButtonTitle: 'Messages',
//                     onRightButtonPress: this.messages
//                   });
//                 } else {
//                   this.setState({
//                     message: responseJson.error
//                   })
//                 }
//               })
//               .catch((err) => {
//                 /* do something if there was an error with fetching */
//                 console.log(err)
//               });
//             },
//             messages(){
//               this.props.navigator.push({
//                 component: Messages,
//                 title: "Messages"
//               })
//             },
//             componentDidMount() {
//               AsyncStorage.getItem('user')
//               .then(result => {
//                 console.log('inside')
//                 var parsedResult = JSON.parse(result);
//                 var username = parsedResult.username;
//                 var password = parsedResult.password;
//                 if (username && password) {
//                   console.log('inside again')
//                   return (this.login(username, password))
//                 }
//                 // Don't really need an else clause, we don't do anything in this case.
//               })
//               .catch(err => { /* handle the error */ })
//             },
//             press() {
//               this.props.navigator.push({
//                 component: LoginPage,
//                 title: "Login Page"
//               });
//             },
//             register() {
//               this.props.navigator.push({
//                 component: Register,
//                 title: "Register"
//               });
//             },
//             photo() {
//               this.props.navigator.push({
//                 component: CameraRollPicker,
//                 title: 'Add Photo'
//               })
//             },
//             render() {
//               return (
//                 <View style={styles.container}>
//                 <Image source={{uri:'https://pngimg.com/upload_small/santa_claus/santa_claus_PNG9965.png'}}
//                 style={{width: 200, height: 200}}/>
//                 <Text style={styles.textBig}>Login to HoHoHo!</Text>
//                 <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
//                 <Text style={styles.buttonLabel}>Tap to Login</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
//                 <Text style={styles.buttonLabel}>Tap to Register</Text>
//                 </TouchableOpacity>
//                 </View>
//               );
//             }
//           });
//
//           const styles = StyleSheet.create({
//             container: {
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#F5FCFF',
//             },
//             containerRegister: {
//               flex: 1,
//               justifyContent: 'center',
//               backgroundColor: '#F5FCFF',
//             },
//             containerFull: {
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'stretch',
//               backgroundColor: '#F5FCFF',
//             },
//             welcome: {
//               fontSize: 20,
//               textAlign: 'center',
//               margin: 10,
//             },
//             instructions: {
//               textAlign: 'center',
//               color: '#333333',
//               marginBottom: 5,
//             },
//             textBig: {
//               fontSize: 36,
//               textAlign: 'center',
//               margin: 10,
//             },
//             register: {
//               fontSize: 36,
//               textAlign: 'center',
//               margin: 10
//             },
//             button: {
//               alignSelf: 'stretch',
//               paddingTop: 10,
//               paddingBottom: 10,
//               marginTop: 10,
//               marginLeft: 5,
//               marginRight: 5,
//               borderRadius: 5
//             },
//             buttonRed: {
//               backgroundColor: '#FF585B',
//             },
//             buttonBlue: {
//               backgroundColor: '#0074D9',
//             },
//             buttonGreen: {
//               backgroundColor: '#2ECC40'
//             },
//             buttonLabel: {
//               textAlign: 'center',
//               fontSize: 16,
//               color: 'white'
//             }
//           });
//
//           AppRegistry.registerComponent('hohoho', () => hohoho );
