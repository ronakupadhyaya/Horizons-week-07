const React = require('react');
const AppRegistry = require('react-native').AppRegistry;
const Navigator = require('react-native').Navigator;
const Text = require('react-native').Text;
const View = require('react-native').View;
const TouchableOpacity = require('react-native').TouchableOpacity;

// This is the root view
const hohoho_frontend = React.createClass({
  render: function() {
    return (
      <Navigator
        initialRoute={{ index: 0 }}
        renderScene={function(route, navigator) {
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
});

const LoginScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login screen</Text>
        <TouchableOpacity onPress={this.props.onForward}>
          <Text>Tap to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

const MainScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Main app</Text>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text>Tap to go back to Login Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

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

AppRegistry.registerComponent('hohoho_frontend', function() { return hohoho_frontend });
