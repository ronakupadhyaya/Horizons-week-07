import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ListView,
    Alert,
    Button,
    Dimensions
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Login'
    };
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
            if(responseJson.success) {
                console.log('This is the response JSON', responseJson);
                this.props.navigation.navigate('Users');
            } else {
                alert('The username and password combination is not recognized');
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    register() {
        this.props.navigation.navigate('Register');
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textBig}>Login to HoHoHo!</Text>
                <TextInput
                  style={{marginLeft: 5, height: 40}}
                  placeholder="Enter your username"
                  onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                  style={{marginLeft: 5, height: 40}}
                  secureTextEntry={true}
                  placeholder="Enter your password"
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
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    static navigationOptions = {
        title: 'Register'
    };
    register() {
        if(this.state.username.length === 0 && this.state.password.length === 0) {
            alert('Username and password required');
        } else if (this.state.username.length === 0) {
            alert('Username is required')
        } else if (this.state.password.length <= 4) {
            alert('Password must be over four characters in length');
        } else {
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
                if(responseJson.success) {
                    console.log('This is the response JSON', responseJson);
                    this.props.navigation.navigate('Login');
                } else {
                    alert('There was an error with registration');
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
    render() {
        return (
            <View style={styles.container, {justifyContent: 'center'}}>
                <Text style={styles.textBig}>Register</Text>
                <TextInput
                  style={{marginLeft: 5, height: 40}}
                  placeholder="Enter your username"
                  onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                  style={{marginLeft: 5, height: 40}}
                  secureTextEntry={true}
                  placeholder="Enter your password"
                  onChangeText={(text) => this.setState({password: text})}
                />
                <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
                    <Text style={styles.buttonLabel}>Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class UsersScreen extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
        fetch('https://hohoho-backend.herokuapp.com/users')
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                dataSource: ds.cloneWithRows(responseJson.users)
            });
        })
    }
    static navigationOptions = ({ navigation }) => ({
        title: 'Users Screen',
        headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
    });
    messages() {
        this.props.navigation.navigate('Messages');
    }
    componentDidMount() {
        this.props.navigation.setParams({
            onRightPress: this.messages.bind(this)
        })
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
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.success) {
                alert('Your Ho Ho Ho! to ' + user.username + ' has been sent!');
            } else {
                alert('Your Ho Ho Ho! to ' + user.username + ' could not be sent.');
            }
        })
    }
    render() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => (row1 !== row2)
        });
        return(
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
                        <Text>{rowData.username}</Text>
                    </TouchableOpacity>}
                />
            </View>
        )
    }
}

class MessageScreen extends React.Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
        };
        fetch('https://hohoho-backend.herokuapp.com/messages')
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                dataSource: ds.cloneWithRows(responseJson.messages)
            });
        })
    }
    static navigationOptions = {
        title: 'Messages'
    };
    render() {
        console.log(this.state.dataSource);
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => (row1 !== row2)
        });
        return(
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <View style={styles.list}>
                        <Text>From: {rowData.from.username}</Text>
                        <Text>To: {rowData.to.username}</Text>
                        <Text>Time: {rowData.timestamp}</Text>
                    </View>}
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
        screen: UsersScreen,
    },
    Messages: {
        screen: MessageScreen
    }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
    list: {
        width: Dimensions.get('window').width*0.9,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        padding: 4
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderColor: 'black'
    },
    containerFull: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF'
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
