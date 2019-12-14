import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SlideButton from './SlideButton';
import { FlatGrid } from 'react-native-super-grid';
import Deck from './Deck'

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
  state = {
    deck: [],
    discard: [],
    cards: [],
    game: -1
  }

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
    console.log("Biscuit 1")
    const {cards} = this.state
    console.log("Biscuit cards" + cards)
    console.log(item.y)
console.log(item.x)
    const {suit, value} = cards[item.y][item.x]

    return (<View style={[styles.itemContainer, { backgroundColor: 'red', height: 100 }]}>
      <Text>{suit} {value}</Text>
    </View>)
  }

  setup()  {

  console.log("Setup called")
    const {cards, deck, discard} = Deck.gameStart()
    console.log(deck.length)
    this.setState({
      cards,
      deck,
      discard,
      game: 1
    })
  }

  componentDidMount() {
    this.setup()
  }

  render() {
    const {game, cards} = this.state;
    if (game === -1) {
      console.log("Rendering null")
      return (<View />)
    }

     const layout = [
          null, b0, b1, b2, null,
          b11, {...cards[0][0], x: 0, y: 0}, {...cards[0][1], x: 1, y: 0}, {...cards[0][2], x: 2, y: 0}, b3,
          b10, {...cards[1][0], x: 0, y: 1}, {...cards[1][1], x: 1, y: 1}, {...cards[1][2], x: 1, y: 2}, b4,
          b9, {...cards[2][0], x: 0, y: 2}, {...cards[2][1], x: 1, y: 2},  {...cards[2][2], x: 2, y: 2}, b5,
          null, b8, b7, b6, null
        ];
    
    return (
        <View style={styles.container}>
      <FlatGrid
        itemDimension={itemDimension}
        items={layout}
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
