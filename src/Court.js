import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SlideButton from './SlideButton';
import { FlatGrid } from 'react-native-super-grid';

const width = Dimensions.get('window').width
const itemDimension = (width / 6)

//0 button 1 card
//0123 nesw

//12 buttons in clockwise
const b0  = {x: 0, y: 0, d: 2, b: true}
const b1  = {x: 1, y: 0, d: 2, b: true}
const b2  = {x: 2, y: 0, d: 2, b: true}
const b3  = {x: 2, y: 0, d: 3, b: true}
const b4  = {x: 2, y: 1, d: 3, b: true}
const b5  = {x: 2, y: 1, d: 3, b: true}
const b6  = {x: 2, y: 2, d: 0, b: true}
const b7  = {x: 1, y: 2, d: 0, b: true}
const b8  = {x: 0, y: 2, d: 0, b: true}
const b9  = {x: 0, y: 2, d: 1, b: true}
const b10 = {x: 0, y: 1, d: 1, b: true}
const b11 = {x: 0, y: 0, d: 1, b: true}

const c0  = {x: 0, y: 0}
const c1  = {x: 1, y: 0}
const c2  = {x: 2, y: 0}
const c3  = {x: 0, y: 1}
const c4  = {x: 1, y: 1}
const c5  = {x: 2, y: 1}
const c6  = {x: 0, y: 2}
const c7  = {x: 1, y: 2}
const c8  = {x: 2, y: 2}

export default class Court extends React.Component {
  slidePressed = ({x, y, d}) => {
    console.log(`Slide pressed ${x} ${y} ${d}`);
  }

  _renderItem = ({item, index}) => {
    if (item === null) {
      return (<View style={[styles.itemContainer, { backgroundColor: '000' }] }>
        <Text>Null</Text>
      </View>)
    } else if (item.b) {
      return (<View style={[styles.itemContainer, { backgroundColor: 'green'} ]}>
        <TouchableOpacity onPress={() => this.slidePressed(item)}>
          <Text>Hey</Text>
        </TouchableOpacity>
      </View>)
    }

    return (<View style={[styles.itemContainer, { backgroundColor: 'red', height: 100 }]}>
      <Text>{item.x} {item.y}</Text>
    </View>)
  }

  render() {
     const items = [
          null, b0, b1, b2, null,
          b11, c0, c1, c2, b3,
          b10, c3, c4, c5, b4,
          b9, c6, c7, c8, b5,
          null, b8, b7, b6, null
        ];

    return (
        <View style={styles.container}>
      <FlatGrid
        itemDimension={itemDimension}
        items={items}
        style={styles.gridView}
        // fixed
        // spacing={20}
        renderItem={this._renderItem}
      />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 500
  },
});
