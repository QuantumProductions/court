import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Deck, nums} from './Deck'
import Row from './Row'
import {Card, cardw, cardh} from './Card'
import IntroCard from './IntroCard'
import IntroRow from './IntroRow'
import Overlook from './Overlook'

console.log("imported card" + Card)

const width = Dimensions.get('window').width

export default class Court extends React.Component {
  state = {
    deck: [],
    discard: [],
    cards: [],
    game: -1,
    newCard: {suit: "D", value: "a"},
    mode: 0
  }

  canSlide(cardOff, newCard) {
    return true
    if (newCard.value === "a") {
      return true
    }
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
        return nums.indexOf(newValue) > nums.indexOf(offValue)
      } else {
        return false
      }
    }

    return newValue === offValue
  }

  slidePressed = ({x, y, d}, direction) => {
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
      this.positions = positions
      this.middleCard = {...middleCard, card2: null}
      this.firstCard = {...firstCard, card2: null}
      this.newCard = {...newCard, card2: null}

      cards[p3[1]][p3[0]].card2 = this.middleCard
      cards[p2[1]][p2[0]].card2 = this.firstCard
      cards[p1[1]][p1[0]].card2 = this.newCard

      this.setState({
        animation: {
          animationP: 0.0,
          animationDirection: direction
        },
        cards: cards
      }, () => {
        this.animatePForward()
    })
    }
  }

  animatePForward = () => {
    const {animation} = this.state
    if (!animation) {
      return
    }
    if (animation.animationP < 1) {
       this.setState({
        animation: {
          ...animation,
          animationP: Math.min(1.0, animation.animationP + 0.3),
        }
       }, () => {
        setTimeout(this.animatePForward, 50)
       })
    } else {
      let {cards} = this.state
      let [p1,p2,p3] = this.positions
         cards[p3[1]][p3[0]] = this.middleCard
        cards[p2[1]][p2[0]] = this.firstCard
        cards[p1[1]][p1[0]] = this.newCard
      this.setState({
        animation: null,
        cards: cards
      })
 
    }
  }

  setup()  {
    const {cards, deck, discard} = Deck.gameStart()
    this.setState({
      cards,
      deck,
      discard,
      game: 0
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

  onSwipe = (x, y, d) => {
    if (this.state.animation) {
      return
    }
    let nd = 0;
    if (d === "south") {
      if (x == 0) {
        nd = 0
      } else if ( x == 1) {
        nd = 1
      } else if ( x == 2) {
        nd = 2
      }
    } else if (d === "north") {
      if (x == 2) {
        nd = 6
      } else if ( x == 1) {
        nd = 7
      } else if ( x == 0) {
        nd = 8
      }
    } else if (d === "west") {
      if (y == 0) {
        nd = 3
      } else if ( y == 1) {
        nd = 4
      } else if ( y == 2) {
        nd = 5
      }
    } else if (d === "east") {
      if (y == 2) {
        nd = 9
      } else if (y == 1) {
        nd = 10
      } else if (y == 0) {
        nd = 11
      }
    }

    this.direction = d

    this.slidePressed({x,y,d: nd}, d)
  }

  helpPressed = () => {
    this.setState({mode: 0})
  }

  courtButtonPressed = () => {
    if (this.state.mode === 0) {
      this.setState({mode: 1})
    }
  }

  createRows = (cards) => {
    let views = []
    let bottomY = cardh * 3
    let leftX = 0

    let yIncrement = cardh
    let xIncrement = cardw

    for (let cardRow of cards) {
      for (let c of cardRow) {
        let cardView = <Card data={c} style={{position: 'absolute', left: leftX, bottom: bottomY}} />
        views.push(cardView)
        leftX += xIncrement
        if (views.length % 3 === 0) {
          leftX = 0
        }
      }
      bottomY -= yIncrement
    }

    return views
  }

  render() {
    const {game, cards, newCard, mode, animation} = this.state;
    if (game === -1) {
      const animation = {animationP: 0.8, animationDirection: "south"}
      return (
        <Card data={{...newCard, card2: {...newCard, value: "a"}}} animation={animation} />
      )

      return (<View />)
    }
    if (mode === 0) {
      const texts1 = [
        "Court is a 3x3 grid.",
        "Win with 3 of the same rank aligned.",
        "Swipe to slide a row or column. Your New Card can only slide on if the old card rules match.",

      ]
      const texts2 = [
        "♦ off: Any card can slide on.",
        "♥ off: any higher ♦♥♣♠ slides on.",
        "♣ off: Any higher ♣ or any ♠ slides on."
      ]

      const texts3 = [
        "♠ off: same value ♦♥♣ slides on. Aces always slide on.",
        "Aces are low points, Kings are high points.",
        "Tap the button below to start."
      ]

      const courtText = game === 0 ? "HOLD COURT" : "CONTINUE COURT"

      const rows = this.createRows(cards)

      return (
        <View style={styles.container}>
        <View style={styles.topCard}>
          <IntroCard data="New Card" onSwipe={() => {}} />
        </View>
       <View style={styles.game}>
          {rows}
       </View>
       <TouchableOpacity style={styles.button} onPress={this.courtButtonPressed} >
          <Text style={styles.text}>
            {courtText}
          </Text>
       </TouchableOpacity>
       </View>
      )
    }

    let animationP = 1.0
    if (animation) {
      animationP = animation.animationP
    }
    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Card data={newCard} onSwipe={() => {}} animation={{animationP: animationP, animationDirection: "east"}} />
          <Overlook data={this.state} helpPressed={this.helpPressed} />
        </View>
     <View style={styles.game}>
       <Row cards={cards[0]} y={0} onSwipe={this.onSwipe} animation={animation} />
       <Row cards={cards[1]} y={1} onSwipe={this.onSwipe} animation={animation} />
       <Row cards={cards[2]} y={2} onSwipe={this.onSwipe} animation={animation} />
     </View>
     </View>
    )
  }
}

const styles = StyleSheet.create({
  topRow: {
    marginTop: 20,
    flexDirection: 'row',
    width: width
  },
  game: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  container: {
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    paddingBottom: 20
  },
  text: {
    fontFamily: 'blackchancery',
    color: '#fff',
    backgroundColor: '#000',
    width: width,
    borderWidth: 1,
    fontSize: 36,
    borderColor: '#fff',
    height: 44,
    textAlign: 'center',
    alignSelf: 'center'
  }
});
