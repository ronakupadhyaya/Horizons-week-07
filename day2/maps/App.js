import React from 'react';
import {
    AsyncStorage,
    TouchableOpacity,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    MapView
} from 'expo';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            lat: 0,
            lng: 0,
        };
    };

    componentDidMount() {
        AsyncStorage.getItem('changed')
            .then((region) => {
                let res = JSON.parse(region);
                console.log(res, "in changed")
                this.setState({lat: res.latitude, lng: res.longitude});
            })
    }

    move(city) {
        switch (city) {
            case 'ist':
                this.setState({lat: 41.067841, lng: 29.045258});
                break;
            case 'syd':
                this.setState({lat: -33.866174, lng: 151.220345});
                break;
            case 'hk':
                this.setState({lat: 22.294074, lng: 114.171995});
                break;
            case 'here':
                navigator.geolocation.getCurrentPosition(
                    (success) => {
                        this.setState({lat: success.coords.latitude, lng: success.coords.longitude});
                    },
                    (err) => {
                        console.log(err);
                    }
                )
                break;
            default:
                return;
        }
    }

    onRegionChange(region) {
        console.log("in reg change");
        this.setState({lat: region.latitude, lng: region.longitude});
        console.log(region);
        AsyncStorage.setItem('changed', JSON.stringify(region));
    }

    render() {
        return (
            <View style={{
                flex: 1
            }}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={this.move.bind(this, 'ist')}
                    style={{flex: 1,
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                        <Text>Istanbul</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.move.bind(this, 'syd')}
                        style={{flex: 1,
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center'}}>
                            <Text>Sydney</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.move.bind(this, 'hk')}
                            style={{flex: 1,
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center'}}>
                                <Text>Hong Kong</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.move.bind(this, 'here')}
                                style={{flex: 1,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'}}>
                                    <Text>Here</Text>
                                </TouchableOpacity>
                            </View>
                            <MapView
                                style={{flex: 7}}
                                onRegionChange={this.onRegionChange.bind(this)}
                                region={{
                                    latitude: this.state.lat,
                                    longitude: this.state.lng,
                                    latitudeDelta: 0.5,
                                    longitudeDelta: 0.5
                                }}
                            />
                        </View>
                    );
                }
            }

            export default App;
