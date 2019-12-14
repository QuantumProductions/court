import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SlideButton from './SlideButton';
import { FlatGrid } from 'react-native-super-grid';
import {Deck, nums} from './Deck'
import Card from './Card'

const width = Dimensions.get('window').width
const itemDimension = (width / 6)

//0 button 1 card
//0123 nesw

//12 buttons in clockwise
const b0  = {x: 0, y: 0, d: 0, b: true}
const b1  = {x: 1, y: 0, d: 1, b: true}
const b2  = {x: 2, y: 0, d: 2, b: true}
const b3  = {x: 2, y: 0, d: 3, b: true}
const b4  = {x: 2, y: 1, d: 4, b: true}
const b5  = {x: 2, y: 1, d: 5, b: true}
const b6  = {x: 2, y: 2, d: 6, b: true}
const b7  = {x: 1, y: 2, d: 7, b: true}
const b8  = {x: 0, y: 2, d: 8, b: true}
const b9  = {x: 0, y: 2, d: 9, b: true}
const b10 = {x: 0, y: 1, d: 10, b: true}
const b11 = {x: 0, y: 0, d: 11, b: true}

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
    game: -1,
    newCard: {suit: null, value: null}
  }

  canSlide(cardOff, newCard) {
    let offSuit = cardOff.suit
    if (offSuit === "D") {
      return true
    }
    let offValue = cardOff.value
    let newValue = newCard.value
    if (offSuit === "H") {
      return nums.indexOf(newValue) > nums.indexOf(offValue)
    }
    let newSuit = newCard.suit
    if (offSuit === "C") {
      if (newSuit === "S") {
        return true
      } else if (newSuit === "C") {
        return nums.indexOf(newValue) > nums.indexOff(offValue)
      } else {
        return false
      }
    }

    return newValue === offValue
  }

  slidePressed = ({x, y, d}) => {
    const lists = [
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],

      [[2,0], [1,0], [0,0]],
      [[2,1], [1,1], [0,1]],
      [[2,2], [1,2], [0,2]],

      [[2,2], [2,1], [2,0]],
      [[1,2], [1,1], [1,0]],
      [[0,2], [0,1], [0,0]],

      [[0,2], [1,2], [2,2]],
      [[0,1], [1,1], [2,1]],
      [[0,0], [1,0], [2,0]]
    ]

    let positions = lists[d]
    let [p1,p2,p3] = positions
    let {newCard, cards, deck} = this.state
    let cardOff = cards[p3[1]][p3[0]]
    let middleCard = cards[p2[1]][p2[0]]
    let firstCard = cards[p1[1]][p1[0]]
    let newCards = [null, null, null]
    if (this.canSlide(cardOff, newCard)) {
      cards[p3[1]][p3[0]] = middleCard
      cards[p2[1]][p2[0]] = firstCard
      cards[p1[1]][p1[0]] = newCard

      this.setState({
        cards: cards
      }, this.drawCard)
    }

    console.log(`Slide pressed ${x} ${y} ${d}`);
  }

  _renderItem = ({item, index}) => {
    if (item === null) {
      return (<View style={[styles.itemContainer, { backgroundColor: '000' }] }>
        <Text>Null</Text>
      </View>)
    } else if (item.b) {
      let text = "VVV"
      if (item.d > 2 && item.d < 6) {
        text = "<<<"
      } else if (item.d > 5 && item.d < 9) {
        text = "^^^"
      } else if (item.d > 8) {
        text = ">>>"
      }
      return (<View style={[styles.itemContainer, { backgroundColor: 'green', height: 44} ]}>
        <TouchableOpacity onPress={() => this.slidePressed(item)}>
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      </View>)
    }
    const {cards} = this.state
    const {suit, value} = cards[item.y][item.x]

    return (<View style={[styles.itemContainer, { backgroundColor: '#777', height: 100 }]}>
      <Card suit={suit} value={value} />
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
    }, this.drawCard)
  }

  drawCard = () => {
    let {deck} = this.state
    const newCard = deck.pop()
    this.setState({newCard: newCard, deck: deck})
  }

  componentDidMount() {
    this.setup()
  }

  render() {
    const {game, cards, newCard} = this.state;
    if (game === -1) {
      console.log("Rendering null")
      return (<View />)
    }

     const layout = [
          null, b0, b1, b2, null,
          b11, {...cards[0][0], x: 0, y: 0}, {...cards[0][1], x: 1, y: 0}, {...cards[0][2], x: 2, y: 0}, b3,
          b10, {...cards[1][0], x: 0, y: 1}, {...cards[1][1], x: 1, y: 1}, {...cards[1][2], x: 2, y: 1}, b4,
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
        <Card suit={newCard.suit} value={newCard.value} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    height: 500,
    marginBottom: 100
  },
  text: {
    color: '#fff',
    width: 44,
    height: 44
  }
});
