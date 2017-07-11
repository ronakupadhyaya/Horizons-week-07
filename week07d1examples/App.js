import React from 'react';
import _ from 'underscore';
// var _ = require('underscore');
import { TouchableOpacity, StyleSheet, Text, View, ListView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  blue: {
    color: 'blue',
    fontSize: 40,
    fontWeight: 'bold'
  },
  red: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  redBox: {
    height: 80,
    width: 80,
    backgroundColor: 'red'
  }
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // upperLimit: 11,
      // numbers: _.range(this.state.upperLimit),
      // wordCount: 0
      products: []
    }
  }
  disappear() {
    this.setState({
      backgroundColor: 'white'
    })
  }

  up() {
    this.setState({
      number: this.state.number+1
    })
  }
  down() {
    this.setState({
      number: this.state.number-1
    })
  }

  press(item){
    this.setState({
      numbers: this.state.numbers.filter((itemInArr) => (item !== itemInArr))
    })
  }

  increase(){
    this.setState({
      upperLimit: this.state.upperLimit+1
    })
  }
  decrease(){
    this.setState({
      upperLimit: this.state.upperLimit-1
    })
  }

  // componentDidMount() {
  //   fetch('https://horizons-json-cors.s3.amazonaws.com/poem.txt')
  //   // .then((resp) => (console.log(resp.text())))
  //   // .then((resp) => (resp.text().replace(/[!,?.":;]/g,' ')))
  //   .then((resp) => (resp.text()))
  //   .then((text) => text.replace(/[!,?.":;]/g,' '))
  //   // .then((text) => (console.log(text)))
  //   .then((noPunc) => (noPunc.split(" ")))
  //   .then((words) => (
  //     this.setState({
  //       wordCount: words.length
  //     })
  //   ))
  //   .catch((err) => {
  //     console.log('error', err);
  //   });
  // }

  componentDidMount() {
    console.log("Before fetch");
    fetch('https://horizons-json-cors.s3.amazonaws.com/products.json')
    .then((resp) => resp.json())
    .then((pdts) => {
      console.log("Hellooooooo");
      return Promise.all(pdts.map((pdt) => fetch(pdt.url)))
    })
    // .then((pdtArr) => (console.log(pdtArr)))
    .then((pdtObjs) => {
      console.log("REACHED HERuuE?");
      return Promise.all(pdtObjs.map((pdt) => pdt.json()))
      // pdtObjs.sort(function(a, b) {
      //   return parseFloat(a.priceCents) - parseFloat(b.priceCents);
      // })
    })
    .then((pdts) => {
      return pdts.sort(function(a, b) {
        return parseFloat(a.priceCents) - parseFloat(b.priceCents);
      })
    })
    .then((pdtArr) => (
      this.setState({
        products: pdtArr
      })
    ))
    .catch((err) => {
      console.log('error', err);
    });
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    })
    return (
      <View style={styles.container}>
        {/* <Text>Words in poem: {this.state.wordCount}</Text> */}
        {/* <ListView
          renderRow={(item) => (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity>
                <Text>{item}</Text>
              </TouchableOpacity>
            </View>
          )}
          dataSource={dataSource.cloneWithRows(_.range(this.state.upperLimit))}
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={this.increase.bind(this)}>
         <Text>Increase N</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.decrease.bind(this)}>
           <Text>Decrease N</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.buttonContainer} onPress={this.up.bind(this)}>
          <Text>Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.down.bind(this)}>
          <Text>Down</Text>
        </TouchableOpacity> */}
        <ListView
          renderRow={(item) => (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity style={{borderWidth: 1}}>
                <Text>{item.name}: {item.priceCents/100}</Text>
              </TouchableOpacity>
            </View>
          )}
          dataSource={dataSource.cloneWithRows(this.state.products)}
        />
      </View>
    );
  }
}
