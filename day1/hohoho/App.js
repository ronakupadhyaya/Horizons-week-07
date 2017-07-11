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
const url = 'https://hohoho-backend.herokuapp.com/'


//Screens
class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Home'
    });

    press() {
        this.props.navigation.navigate('Login');
    }
    register() {
        this.props.navigation.navigate('Register');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textBig}>Login to HoHoHo!</Text>
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

    constructor() {
        super();
        this.state = {
            username: "",
            password: ""
        }
    }

    register() {
        fetch(url + 'register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.success) {
                this.props.navigation.goBack();
            }
        })
        .catch((err) => {
            console.log('Error: ' + err);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({username: text})}
                    value={this.state.username}
                    placeholder='Username'
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.register()} }>
                    <Text style={styles.buttonLabel}>Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class LoginScreen extends React.Component {

    static navigationOptions = {
        title: 'Login'
    };

    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            message: ""
        }
    }

    login() {
        fetch(url + 'login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.success) {
                this.props.navigation.navigate('Users')
            } else {
                this.setState({message: "Failed Login Authentication"});
            }
        })
        .catch((err) => {
            console.log('Error: ' + err);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.message}</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({username: text})}
                    value={this.state.username}
                    placeholder='Username'
                />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.login()} }>
                    <Text style={styles.buttonLabel}>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class UsersScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Users',
        headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
    });

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([])
        };
        fetch(url + 'users', {method: 'GET'})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.success) {
                this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
            }
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onRightPress: this.messages.bind(this)
        })
    }


    touchUser(user) {
        fetch(url + 'messages', {
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
            if (responseJson.success) {
                Alert.alert(
                    'Success',
                    'Your HoHoHo to ' + user.username + ' has been sent',
                    [{text: 'Dismiss'}] // Button
                )
            }
        })
    }

    messages() {
        this.props.navigation.navigate('Messages');
    }

    render() {
        return(
                <View style={{flex:1}}>
                    {this.state.dataSource.rowIdentities[0].length === 0 ?
                        <Text style={styles.loadText}> Users are loading...</Text> :
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) =>
                                <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
                                    <Text style={styles.users}>{rowData.username}
                                    </Text>
                                </TouchableOpacity>}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
                        />
                    }
                </View>
        );
    }
}

class MessagesScreen extends React.Component {

    static navigationOptions = {
        title: 'Messages'
    };

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([])
        };
        fetch(url + 'messages', {method: 'GET'})
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.success) {
                this.setState({dataSource: ds.cloneWithRows(responseJson.messages)});
            }
        })
    }

    render() {
        return(
                <View style={{flex:1}}>
                    {this.state.dataSource.rowIdentities[0].length === 0 ?
                        <Text style={styles.loadText}> Messages are loading...</Text> :
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) =>
                                <View style={styles.messageContainer}>
                                    <Text style={styles.messageText}>From: {rowData.from.username}
                                    </Text>
                                    <Text style={styles.messageText}>To: {rowData.to.username}
                                    </Text>
                                    <Text style={styles.messageText}>To: {rowData.body}
                                    </Text>
                                    <Text style={styles.messageText}>When: {rowData.timestamp}
                                    </Text>
                                </View>}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
                        />
                    }
                </View>
        );
    }
}


//Navigator
export default StackNavigator({
    Home: {
        screen: HomeScreen,
    },
    Register: {
        screen: RegisterScreen,
    },
    Login: {
        screen: LoginScreen
    },
    Users: {
        screen: UsersScreen
    },
    Messages: {
        screen: MessagesScreen
    }
}, {initialRouteName: 'Home'});


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
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 5
    },
    users: {
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5
    },
    seperator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'black'
    },
    loadText: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 20
    },
    messageContainer: {
        padding: 10
    },
    messageText: {
        fontSize: 15,
        margin: 5
    }
});
