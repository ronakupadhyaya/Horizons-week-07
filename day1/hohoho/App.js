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
const url = 'https://hohoho-backend.herokuapp.com/';

//Screens
class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Home'
	};

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

class MessagesScreen extends React.Component {
	static navigationOptions = {
		title: 'Messages'
	};

	constructor(props) {
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		fetch('https://hohoho-backend.herokuapp.com/messages', {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.success === true) {
				console.log("Success true", responseJson.messages);
				this.setState({
					dataSource: ds.cloneWithRows(responseJson.messages)
				})
			}
		})
		.catch((err) => {
			console.log('Error rendering messages, ', err);
			Alert.alert(
				'Rendering message',
				'Error rendering messages'
				[{text: 'Done'}]
			);
		})

		this.state = {
			dataSource: ds.cloneWithRows([])
		};
	}

	render() {

		return (
		<ListView
			dataSource={this.state.dataSource}
			renderRow={(rowData) => {
				console.log('rowData: ', rowData);
				return <Text> From: {rowData.from.username} To: {rowData.to.username} When: {rowData.timestamp}</Text>
			}}
		/>);
	}
}

class UsersScreen extends React.Component {

	componentDidMount() {
		this.props.navigation.setParams({
			onRightPress: this.messages.bind(this)
		});
	}


	static navigationOptions = (props) =>  ({
		title: 'Users',
		headerRight: <Button title='Messages' onPress={ () => {props.navigation.state.params.onRightPress()} } />
	});


	messages() {
		this.props.navigation.navigate('Messages');
	}
	touchUser(user) {
		fetch('https://hohoho-backend.herokuapp.com/messages', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				to: user._id,
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log('user: ', user);
			if(responseJson.success){
				Alert.alert(
					'Sent message',
					'Your Ho Ho Ho to ' + user.username + ' has been sent!',
					[{text: 'Done'}]
				);
			}  else {
				Alert.alert(
					'Sending message',
					'Your Ho Ho Ho to ' + user.id + ' could not be sent.'
					[{text: 'Send'}]
				);
			}
		})
		.catch((err) => {
			Alert.alert(
				'Sending message',
				'Error sending message',
				[{text: 'Send'}]
			);
		})
	}

	//navigationOptions code
	constructor(props) {
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		fetch('https://hohoho-backend.herokuapp.com/users', {
			method: 'GET',
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log('json: ', responseJson);
			if(responseJson.success === true) {
				console.log("Success true", responseJson.users);
				this.setState({
					dataSource: ds.cloneWithRows(responseJson.users)
				})
			}
		})
		.catch((err) => {
			/* do something if there was an error with fetching */
			console.log('errOR', err);
			return null;
		});
		this.state = {
			dataSource: ds.cloneWithRows([])
		};
	}

	render() {
		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={(rowData) => {
					console.log('rowData: ', rowData.username);
					return <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}><Text>{rowData.username}</Text></TouchableOpacity>
				}}
			/>
		);
	}


}

class LoginScreen extends React.Component {
	static navigationOptions = {
		title: 'Login',
	};

	constructor(props) {
		super(props);

		this.state = { usernameText: '', passwordText: '' };
	}

	handleRegister() {
		console.log('called');
		fetch('https://hohoho-backend.herokuapp.com/login', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: this.state.usernameText,
				password: this.state.passwordText,
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			/* do something with responseJson and go back to the Login view but
			* make sure to check for responseJson.success! */
			console.log('response: ', responseJson.user.username);
			this.props.navigation.navigate('Users');
		})
		.catch((err) => {
			/* do something if there was an error with fetching */
			console.log('ERR, ', err);
			alert('error', err);
		});
	}

	render() {
		return (<View style={styles.container}>
			<TextInput
				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
				onChangeText={(usernameText) => this.setState({usernameText})}
				value={this.state.usernameText}
				placeholder="Username"
			/>

			<TextInput
				secureTextEntry={true}
				style={{height: 40, borderColor: 'gray', borderWidth: 1}}
				onChangeText={(passwordText) => this.setState({passwordText})}
				value={this.state.passwordText}
				placeholder="Password"
			/>

			<TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={() => this.handleRegister()}>
				<Text style={styles.buttonLabel}> Login </Text>
			</TouchableOpacity>
		</View>);
	}
}

class RegisterScreen extends React.Component {
	static navigationOptions = {
		title: 'Register'
	};

	constructor(props) {
		super(props);
		this.state = { usernameText: '', passwordText: '' };
	}

	handleRegister(){
		console.log('called');
		fetch('https://hohoho-backend.herokuapp.com/register', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: this.state.usernameText,
				password: this.state.passwordText,
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			/* do something with responseJson and go back to the Login view but
			* make sure to check for responseJson.success! */
			alert('Created for ', responseJson.user.username);
			this.props.navigation.navigate('Home');
		})
		.catch((err) => {
			/* do something if there was an error with fetching */
			console.log('ERR, ', err);
			alert('error', err);
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput
					style={{height: 40, borderColor: 'gray', borderWidth: 1}}
					onChangeText={(usernameText) => this.setState({usernameText})}
					value={this.state.usernameText}
					placeholder="Username"
				/>

				<TextInput
					secureTextEntry={true}
					style={{height: 40, borderColor: 'gray', borderWidth: 1}}
					onChangeText={(passwordText) => this.setState({passwordText})}
					value={this.state.passwordText}
					placeholder="Password"
				/>

				<TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={() => this.handleRegister()}>
					<Text style={styles.buttonLabel}> Register </Text>
				</TouchableOpacity>
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
	}
});
