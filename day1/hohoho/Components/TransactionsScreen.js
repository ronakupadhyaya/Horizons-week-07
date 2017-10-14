import React from 'react';
import { ListView, View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

class TransactionsScreen extends React.Component {

  static navigationOptions = ({
    title: 'Transactions',
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {_id: 0, to: 'Jeff Tang', from: 'Mason Liyu', message: 'asian mafia dues 🍚', cryptocurrency: 'Dogecoin', tribe: 'Horizons', timeStamp: '3 hours ago'}
      ])
    };
    /* this.getTransactions(); */
  }

  render() {
    return (

      <View style={styles.container}>
        <ListView
          renderRow={item => {
            return (
              <View key={item._id} style={{borderColor: 'black', borderWidth: 1, padding: 10}}>
                <TouchableOpacity>
                  <Text>{item.from} paid {item.to} in {item.cryptocurrency}</Text>
                  <Text>{item.timeStamp}</Text>
                  <Text>{item.message}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          dataSource={this.state.dataSource}
        />
      </View>

    );
  }
}

export default TransactionsScreen;
