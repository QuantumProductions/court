import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Deck, nums} from './Deck'
import Row from './Row'
import Card from './Card'
import IntroCard from './IntroCard'
import IntroRow from './IntroRow'
import Overlook from './Overlook'

const width = Dimensions.get('window').width

export default class Court extends React.Component {
  state = {
    deck: [],
    discard: [],
    cards: [],
    game: 0,
    newCard: {suit: "D", value: "a"},
    mode: 0
  }

  canSlide(cardOff, newCard) {
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
      this.positions = positions
      this.middleCard = middleCard
      this.firstCard = firstCard
      this.newCard = newCard

      cards[p3[1]][p3[0]].card2 = middleCard
      cards[p2[1]][p2[0]].card2 = firstCard
      cards[p1[1]][p1[0]].card2 = newCard

      this.setState({
        animation: {
          animationP: 0.0,
          animationDirection: "east"
        },
        cards: cards
      }, () => {
        setTimeout(this.animatePForward, 1000)
        //after animation
      //   cards[p3[1]][p3[0]] = middleCard
      //   cards[p2[1]][p2[0]] = firstCard
      //   cards[p1[1]][p1[0]] = newCard

      // this.setState({
      //   animation: null,
      //   cards: cards
      // }, this.drawCard)
    })
    }
  }

  animatePForward = () => {
    if (this.state.animationP < 1) {
       setTimeout(this.animatePForward, 1000)
       this.setState({
        animationP: this.state.animationP + 0.1
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
      }, this.drawCard)
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

    this.slidePressed({x,y,d: nd})
  }

  helpPressed = () => {
    this.setState({mode: 0})
  }

  courtButtonPressed = () => {
    if (this.state.mode === 0) {
      this.setState({mode: 1})
    }
  }

  render() {
    const {game, cards, newCard, mode} = this.state;
    if (game === -1) {
      console.log("Rendering null")
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
      console.log(game)
      return (
        <View style={styles.container}>
        <View style={styles.topCard}>
          <IntroCard data="New Card" onSwipe={() => {}} />
        </View>
       <View style={styles.game}>
         <IntroRow texts={texts1} />
         <IntroRow texts={texts2} />
         <IntroRow texts={texts3} />
       </View>
       <TouchableOpacity style={styles.button} onPress={this.courtButtonPressed} >
          <Text style={styles.text}>
            {courtText}
          </Text>
       </TouchableOpacity>
       </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Card data={newCard} onSwipe={() => {}} animation={{animationP: 0.75, animationDirection: "east"}} />
          <Overlook data={this.state} helpPressed={this.helpPressed} />
        </View>
     <View style={styles.game}>
       <Row cards={cards[0]} y={0} onSwipe={this.onSwipe} />
       <Row cards={cards[1]} y={1} onSwipe={this.onSwipe} />
       <Row cards={cards[2]} y={2} onSwipe={this.onSwipe} />
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
