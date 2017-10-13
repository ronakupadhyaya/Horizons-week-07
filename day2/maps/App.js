import React from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	AsyncStorage
} from 'react-native';

import {MapView} from 'expo';

class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			region: {
				latitude: 39.83333,
				longitude: -98.58334,
				latitudeDelta: 60,
				longitudeDelta: 60
			}
		}
	}

	componentDidMount(){
		console.log('component did mount');
		AsyncStorage.getItem('region')
		.then((region) => {
			this.setState({
				region: JSON.parse(region)
			});
		})
	}



	render() {
		return (
			<View style={{
				flex: 1
			}}>
			<View style={{flex: 1, flexDirection: 'row'}}>
				<TouchableOpacity
					style={{flex: 1,
						borderWidth: 1,
						alignItems: 'center',
						justifyContent: 'center'}}

						onPress={() => {
							this.setState({
								region: {
									latitude: 41.067841,
									longitude: 29.045258,
									latitudeDelta: 0.5,
									longitudeDelta: 0.25
								}
							});
						}}>

						<Text>Istanbul</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{flex: 1,
							borderWidth: 1,
							alignItems: 'center',
							justifyContent: 'center'}}

							onPress={() => {
								this.setState({
									region: {
										latitude: -33.8696,
										longitude: 151.207,
										latitudeDelta: 0.5,
										longitudeDelta: 0.25
									}
								});
							}}>
							<Text>Sydney</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{flex: 1,
								borderWidth: 1,
								alignItems: 'center',
								justifyContent: 'center'}}

								onPress={() => {
									this.setState({
										region: {
											latitude: 22.27981,
											longitude: 114.1618,
											latitudeDelta: 0.5,
											longitudeDelta: 0.25
										}
									});
								}}>

								<Text>Hong Kong</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={{flex: 1,
									borderWidth: 1,
									alignItems: 'center',
									justifyContent: 'center'}}

									onPress={() => {
										navigator.geolocation.getCurrentPosition(
											(success) => {
												this.setState({
													region: {
														latitude: success.coords.latitude,
														longitude: success.coords.longitude,
														latitudeDelta: 0.05,
														longitudeDelta: 0.025
													}
												})
											},
											(error) => {
												alert('error getting user location');
											}
										)
									}}>

									<Text>Here</Text>
								</TouchableOpacity>
							</View>
							<MapView style={{flex: 7}} region={
								this.state.region
							} onRegionChangeComplete={(region) => {
								AsyncStorage.setItem('region', JSON.stringify(region))
								.then(() => this.setState({region: JSON.parse(region)}));
							}}/>
						</View>
					);
				}
			}

			export default App;
