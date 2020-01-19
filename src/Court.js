import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Deck, nums} from './Deck'
import Row from './Row'
import {Card, cardw, cardh} from './Card'
import IntroCard from './IntroCard'
import IntroRow from './IntroRow'
import Overlook from './Overlook'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

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

    const newCardPositions = [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 2],
      [1, 2],
      [0, 2],
      [0, 2],
      [1, 1],
      [0, 0]
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
      this.newCard = newCard
      this.middleCard = middleCard
      this.firstCard = firstCard
      cards[p3[1]][p3[0]].slideDirection = direction
      cards[p2[1]][p2[0]].slideDirection = direction
      cards[p1[1]][p1[0]].slideDirection = direction
      let [ncx, ncy] = newCardPositions[d]
      newCard.x = ncx
      newCard.y = ncy

      this.setState({
        animation: {
          animationP: 0.0,
          animationDirection: direction
        },
        cards: cards,
        newCard: newCard
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
          animationP: Math.min(1.0, animation.animationP + 0.1),
        }
       }, () => {
        setTimeout(this.animatePForward, 50)
       })
    } else {
      let {cards} = this.state
      let [p1,p2,p3] = this.positions
         cards[p3[1]][p3[0]] = {...this.middleCard, slideDirection: null}
         console.log(this.middleCard)
        cards[p2[1]][p2[0]] = {...this.firstCard, slideDirection: null}
        console.log(this.firstCard)
        cards[p1[1]][p1[0]] = {...this.newCard, slideDirection: null}
        console.log(this.newCard)
      this.setState(
        {animation: null
      }, () => {
        this.setState({
          cards: cards
        }, () => {
               this.drawCard()
        })
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
    this.setState({newCard: newCard, deck: deck, animation: null})
  }

  componentDidMount() {
    this.setup()
  }

  onSwipe = (x, y, d) => {
    if (this.state.animation) {
      return
    }
    console.log("Swiping with a d" + d + "x: " +x + "y" + y)
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
    // let dirs = {south: 0, west: 1, north: 2, east: 3}
    console.log("The nd should be" + nd)
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

  createRows = (cards, animation) => {
    let views = []
    let bottomYReset = cardh * 3
    let bottomY = bottomYReset
    let leftXReset = 0

    let yIncrement = cardh
    let xIncrement = cardw

    let x = 0
    let y = 0

    for (let cardRow of cards) {
      bottomY = bottomYReset
      for (let c of cardRow) {
        leftX = leftXReset
        if (animation && c.slideDirection == animation.animationDirection && animation.animationP) {
          if (animation.animationDirection === "east") {
            console.log("East")
            leftX += (animation.animationP * cardw)
          } else if (animation.animationDirection === "west") {
            console.log("West")
            leftX -= (animation.animationP * cardw)
          } else if (animation.animationDirection === "north") {
            console.log("North")
            bottomY += (animation.animationP * cardh)
          } else if (animation.animationDirection === "south") {
            bottomY -= (animation.animationP * cardh)
            console.log("South")
          }
        }
        let cardKey = "Card" + c.suit + "v" + c.value
        let cardView = <Card key={cardKey} x={x} y={y} data={c} style={{position: 'absolute', left: leftX, bottom: bottomY}} onSwipe={this.onSwipe} />
        views.push(cardView)
        leftXReset += xIncrement
        if (views.length % 3 === 0) {
          leftXReset = 0
          y++
          x = 0
        }
        x++
        leftX = leftXReset
        bottomY = bottomYReset
      }
      x = 0
      bottomYReset -= yIncrement

    }

    if (animation) {
      let {x, y} = this.state.newCard
      let newCardBottomY
      if (animation.animationDirection === "west" || animation.animationDirection === "east") {
        if (y === 0) {
          newCardBottomY = cardh * 3;
        } else if (y === 1) {
          newCardBottomY = cardh * 2
        } else {
          newCardBottomY = cardh
        }
      } else if (animation.animationDirection === "north") {
        newCardBottomY = 0
      } else {
        newCardBottomY = cardh * 4
      }

      let newCardStyle
      if (animation.animationDirection === "east") {
        newCardStyle = {position: 'absolute', left: -cardw + ( animation.animationP * cardw), bottom: newCardBottomY}
      } else if (animation.animationDirection === "west") {
        newCardStyle = {position: 'absolute', left: width - (animation.animationP * cardw),  bottom: newCardBottomY}
      } else if (animation.animationDirection === "north") {
        newCardStyle = {position: 'absolute', left: cardw * x,  bottom: newCardBottomY + (animation.animationP * cardh)}
      } else if (animation.animationDirection === "south") {
        newCardStyle = {position: 'absolute', left: cardw * x,  bottom: newCardBottomY - (animation.animationP * cardh)}
      }
      let newCardKey = "Card" + this.state.newCard.suit + "v" + this.state.newCard.value
      let newCard = <Card key={newCardKey} x={x} y={y} data={this.state.newCard} onSwipe={() => {}} style={newCardStyle} />
      views.push(newCard)
    } else {
      console.log("No animation")
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

      return (
        <View style={styles.container}>
        <View style={styles.topRow}>
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

    let animationP = 1.0
    if (animation) {
      animationP = animation.animationP
    }

    const rows = this.createRows(cards, animation)

    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Card data={newCard} onSwipe={() => {}} animation={{animationP: animationP, animationDirection: "east"}} />
        </View>
        <View style={styles.overlook}>
          <Overlook data={this.state} helpPressed={this.helpPressed} />
        </View>
     <View style={styles.game}>
      {rows}
     </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  overlook: {
    position: 'absolute',
    right: 20,
    top: 0,
  },
  topRow: {
    top: 20,
    left: 0,
    position: 'absolute',
    flexDirection: 'row',
    width: width
  },
  game: {
    justifyContent: 'flex-end',
    height: cardh * 3,
    overflow: 'hidden'
  },
  container: {
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    width: width,
    height: height
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
