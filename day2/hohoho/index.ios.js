import React, {Component} from 'react'
import {
  AppRegistry,
  Navigator,
  Text,
  View,
  TouchableOpacity
} from 'react-native'

// This is the root view
class hohoho_frontend extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ index: 0 }}
        renderScene={(route, navigator) => {
          // Function to call when a new scene should be displayed
          function onForward() {
            navigator.push({
              index: route.index + 1,
            });
          }

          // Function to call to go back to the previous scene
          function onBack() {
            if (route.index > 0) {
              navigator.pop();
            }
          }

          switch (route.index) {
            case 0:
              return (
                <LoginScreen
                  onForward={onForward}
                  onBack={onBack}
                />
              );
            case 1:
              return (
                <MainScreen
                  onForward={onForward}
                  onBack={onBack}
                />
              );
            default:
              throw new Error("Unknown route");
          }
        }}
      />
    );
  }
}

class LoginScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login screen</Text>
        <TouchableOpacity onPress={this.props.onForward}>
          <Text>Tap to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class MainScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Main app</Text>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text>Tap to go back to Login Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textBig: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
};

AppRegistry.registerComponent('hohoho_frontend', () => hohoho_frontend );
