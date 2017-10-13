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

class UserScreen extends React.Component {
	static navigationOptions = {
		title: 'User'
	};

	constructor(props) {
		super(props);
	}



}

class LoginScreen extends React.Component {
	static navigationOptions = {
		title: 'Login'
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
			console.log('response: ', responseJson);
			alert('Logged in to ', responseJson.user.username);
			this.props.navigation.navigate('Home');
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
