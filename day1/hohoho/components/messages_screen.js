import React from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ListView,
    Alert,
    Button,
} from 'react-native';
import styles from '../assets/stylesheets/style';
import { StackNavigator } from 'react-navigation';
import {MapView} from 'expo';
class MessagesScreen extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows([
            ])
        };
    }
    static navigationOptions = {
        title: 'Messages',
    };
    componentDidMount() {
        console.log('mounted')
        fetch('https://hohoho-backend.herokuapp.com/messages', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },

        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)

                if (responseJson.success) {
                    console.log('json success')
                    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                    this.setState({

                        dataSource: ds.cloneWithRows(responseJson.messages)
                    })
                }
            })

            .catch((err) => {
                <Text>{err}</Text>
            });
    }

    render() {
        console.log(this.state.dataSource)
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) =>
                    <View>
                        <Text>{rowData.from.username}</Text>
                        <Text>{rowData.to.username}</Text>
                        <Text>{rowData.timestamp}</Text>
                        {(rowData.location && rowData.location.longitude) ?
                            <MapView
                                style={{ width: 25, height: 25 }}
                                showsUserLocation={true}
                                scrollEnabled={false}
                                region={{
                                    longitude: rowData.location.longitude,
                                    latitude: rowData.location.latitude,
                                    longitudeDelta: 1,
                                    latitudeDelta: 1
                                }}
                            /> : null}
                    </View>
                }
            />

        )
    }
}

//Navigator
export default MessagesScreen
