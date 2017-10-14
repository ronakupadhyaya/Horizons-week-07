import React from 'react';
import UsersScreen from './UsersScreen';
import MessagesScreen from './MessagesScreen';
import Swiper from 'react-native-swiper';
import styles from '../styles/styles.js';

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!',
    headerStyle: { marginTop: 25 },
  };

  render() {
    return (
      <Swiper style={styles.container} showsPagination={false} >
        <UsersScreen />
        <MessagesScreen />
      </Swiper>
    )
  }
}

export default SwiperScreen;
