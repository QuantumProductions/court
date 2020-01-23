import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Deck, nums} from './Deck'
import Row from './Row'
import {Card, cardw, cardh} from './Card'
import IntroCard from './IntroCard'
import IntroRow from './IntroRow'
import Overlook from './Overlook'
import AsyncStorage from '@react-native-community/async-storage'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class Court extends React.Component {
  state = {
    deck: [],
    discard: [],
    cards: [],
    game: -1,
    newCard: {suit: "D", value: "a"},
    mode: 0,
    points: 0,
    streaks: [],
    highscore: 0,
    sample: []
  }

  canSlide(cardOff, newCard) {
    if (this.state.won) {
      return false
    }

    if (newCard.value === "a" || cardOff.value === "z") {
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

  lists = [
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

  slidePressed = ({x, y, d}, direction, ignore) => {
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

    let positions = this.lists[d]
    let [p1,p2,p3] = positions

    let {newCard, cards, deck} = this.state
    let cardOff = cards[p3[1]][p3[0]]
    let middleCard = cards[p2[1]][p2[0]]
    let firstCard = cards[p1[1]][p1[0]]
    let newCards = [null, null, null]
    if (ignore) {
      return this.canSlide(cardOff, newCard)
    }

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
        discard: this.state.discard.concat([cardOff]),
        cards: cards,
        newCard: newCard
      }, () => {
        this.animatePForward()
    })
    }
  }

  gameWon = () => {
    const {cards} = this.state
    for (let cardset of this.lists) {
      let match = null
      let matchSum = 0
      for (let coords of cardset) {
        let c = cards[coords[0]][coords[1]]
        if (!match) {
          match = c.value
          matchSum = 1
        } else {
          if (c.value === match) {
            matchSum++
            if (matchSum === 3) {
              return match
            }
          }
        }
      }
    }
    return false
  }

  loadNextTurn = () => {
    let win = this.gameWon()
    if (win) {
      let {discard, points, streaks, highscore} = this.state
      let discardTotal = discard.length
      const processionPoints = {
        "a": 11,
        "2": 22,
        "3": 33,
        "4": 44,
        "5": 55,
        "6": 66,
        "7": 77,
        "8": 88,
        "9": 99,
        "10": 100,
        "j": 250,
        "q": 500,
        "k": 1000}[win]
        let pp = processionPoints + discardTotal
        if (streaks.length < 10) {
          streaks.push(pp)
        } else {
          streaks.splice(0, 1)
          streaks.push(pp)
        }
        let streakNums = '' + String(streaks[0])
        let skip = true
        for (let n of streaks) {
          if (skip) {
            skip = false
            continue
          }
          streakNums += ','
          streakNums += String(n)
        }
        AsyncStorage.setItem('streaks', streakNums)
        let newScore = this.calculateScore(streaks)
        if (newScore > highscore) {
          AsyncStorage.setItem('highscore', String(newScore))
          this.setState({
            highscore: newScore,
            streaks,
            won: true
          })
        } else {
          this.setState({streaks, won: true})  
        }
        
    } else {
      this.drawCard()
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
        setTimeout(this.animatePForward, 5)
       })
    } else {
      let {cards} = this.state
      let [p1,p2,p3] = this.positions
         cards[p3[1]][p3[0]] = {...this.middleCard, slideDirection: null}
        cards[p2[1]][p2[0]] = {...this.firstCard, slideDirection: null}
        cards[p1[1]][p1[0]] = {...this.newCard, slideDirection: null}
      this.setState(
        {animation: null
      }, () => {
        this.setState({
          cards: cards
        }, () => {
          this.loadNextTurn()
        })
      })
    }
  }

  loadStreaks = () => {
    AsyncStorage.getItem('streaks', (err, streaks) => {
      if (err || !streaks) {
        this.setState({
          game: 0
        }, () => {
          this.drawCard()
        })
      } else {
        let ssplit = streaks.split(",")
        let sstreaks = []
        for (let s of ssplit) {
          if (!isNaN(s)) {
            sstreaks.push(parseInt(s))
          } 
        }
        this.setState({
          game: 0,
          streaks: sstreaks
        }, () => {
          this.drawCard()
        })
      }
    })
  }

  setup()  {
    const {cards, deck, discard} = Deck.gameStart()
    this.setState({
      cards,
      deck,
      discard,
      game: -1,
      won: false
    }, () => {
      AsyncStorage.getItem('highscore', (err, highscore) => {
      if (err || !highscore) {
        this.loadStreaks()
      } else {
        this.setState({
          highscore: String(highscore)
        }, () => {
          this.loadStreaks()
        })
      }
    })})
  }

  applyJoker = (joker, deck) => {
    let {cards, discard} = this.state
    let middleCard = cards[1][1]
    cards[1][1] = joker
    this.setState({cards: cards, discard:this.state.discard.concat([middleCard]), deck: deck, animation: null}, () => {
      this.drawCard()
    })
  }

  loseGame = () => {
    const {streaks, highscore} = this.state
    let newScore = this.calculateScore(streaks)
    if (newScore > highscore) {
      AsyncStorage.setItem('highscore', String(newScore))
      this.setState({
        highscore: newScore,
        streaks: [0],
        won: -1
      })
    } else {
      this.setState({
        won: -1,
        streaks: [0]
      })
    }
    AsyncStorage.setItem('streaks', "0")
  }

  cannotMove = () => {
    let pushIndex = 0
    let directions = ["south", "south", "south", "west", "west", "west", "north", "north", "north", "east", "east", "east"]
    for (let l of this.lists) {
      let firstPosition = l[0]
      if (this.slidePressed(
        {x: firstPosition[0], y: firstPosition[1], d: pushIndex},
        directions[pushIndex], true)) {
        return false
      }
      pushIndex++
    }

    return true
  }

  drawCard = () => {
    let {deck} = this.state
    if (deck.length > 0) {
     const newCard = deck.pop()
      if (newCard.value === 'z') {
        this.applyJoker(newCard, deck)
      } else {
         this.setState({newCard: newCard, deck: deck, animation: null}, () => {
          if (this.cannotMove()) {
            this.loseGame()
          }
        })
      }
    } else {
      this.loseGame()
    }
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
    // let dirs = {south: 0, west: 1, north: 2, east: 3}
    this.slidePressed({x,y,d: nd}, d)
  }

  helpPressed = () => {
    if (this.state.animation) {
      return
    }
    this.setState({mode: 0})
  }

  rules2Pressed = () => {
    this.setState({mode: 10})
  }

  courtButtonPressed = () => {
    if (this.state.mode === 0 || this.state.mode === 10 || this.state.mode === 4) {
      this.setState({mode: 1})
    }
  }

  resetPressed = () => {
    this.setup()
  }

  createRows = (cards, animation) => {
    let views = []
    let bottomYReset = cardh * 3
    let bottomY = bottomYReset
    let leftXReset = 0
    let leftX = leftXReset

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
            leftX += (animation.animationP * cardw)
          } else if (animation.animationDirection === "west") {
            leftX -= (animation.animationP * cardw)
          } else if (animation.animationDirection === "north") {
            bottomY += (animation.animationP * cardh)
          } else if (animation.animationDirection === "south") {
            bottomY -= (animation.animationP * cardh)
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
    }

    return views
  }

  showDiscard = () => {
    if (this.state.animation) {
      return
    }

    this.setState({mode: 4})
  }

  discardTextFragment = (cards, index) => {
    if (index === cards.length) {
      return ""
    }
    let c = cards[index]
    if (c.value === 'z') {
      c.value = "?"
    }
    const textStyle = {color: Card.color[c.suit], fontSize: 26, fontWeight: 'bold', fontFamily: 'blackchancery'}
    return (
      <Text style={textStyle}>
        {c.value.toUpperCase()}{Card.suit[c.suit]} {this.discardTextFragment(cards, index + 1)}
      </Text>
    )
  }

  calculateScore = (streaks) => {
    let points = 0
    for (let score of streaks) {
      points += score
    }
    return points
  }

  render() {
    const {game, cards, deck, discard, newCard, mode, animation, streaks, highscore, won} = this.state;
    if (game === -1) {
      const animation = {animationP: 0.8, animationDirection: "south"}
      return (
        <Card data={{...newCard, card2: {...newCard, value: "a"}}} animation={animation} />
      )

      return (<View />)
    }
    if (mode === 4) {
      let discards
      if (discard.length > 0) {
        discards = this.discardTextFragment(discard, 0)
      }
      return (
        <View style={styles.container}>
          <View style={styles.discard}>
            <Text style={styles.text}>Discarded</Text>
            {discards}
          </View>
        <TouchableOpacity style={styles.button} onPress={() => this.courtButtonPressed()} >
            <Text style={styles.text}>
              HOLD COURT
            </Text>
         </TouchableOpacity>
         </View>
      )
    } else if (mode === 0) {
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
        "♠ off: same rank ♦♥♣ slides on. Aces always slide on.",
        "Aces are low points, Kings are high points.",
        "Tap the button below to start."
      ]

      const courtText = "HOLD COURT"

      return (
        <View style={styles.container}>
        <View style={styles.topRow}>
          <IntroCard data="New Card" onSwipe={() => {}} />
        </View>
         <View style={styles.scoring}>
          <Text style={styles.court}>
            High Score
          </Text>
          <Text style={styles.points}>
            {highscore}
          </Text>
        </View>
        <TouchableOpacity onPress={this.rules2Pressed} style={styles.overlook}>
          <Overlook data={this.state} helpPressed={() => {}} text="Rules 2" />
        </TouchableOpacity>
      <View style={styles.game}>
         <IntroRow texts={texts1} />
         <IntroRow texts={texts2} />
         <IntroRow texts={texts3} />
       </View>
       <TouchableOpacity style={styles.button} onPress={() => this.courtButtonPressed()} >
          <Text style={styles.text}>
            {courtText}
          </Text>
       </TouchableOpacity>
       </View>
      )
    } else if (mode === 10) {
      const texts1 = [
        "Jokers sabotage your Court.",
        "Jokers replace the middle card.",
        "Jokers are automatically played. Jokers can always slide off.",

      ]
      const texts2 = [
        "♠s are not allowed in the same row or column in setup.",
        "If this were to happen the ♠ is automatically discarded.",
        "Tap the New Card to view the discard."
      ]

      const texts3 = [
        "When you align 3 of the same rank, you win and score.",
        "Score is summed from the streak of your last 10 games.",
        "Higher rank and higher discard count scores more points."
      ]

      const courtText = game === 0 ? "HOLD COURT" : "CONTINUE COURT"

      return (
        <View style={styles.container}>
        <View style={styles.topRow}>
          <IntroCard data="Tap to view discard" onSwipe={() => {}} />
        </View>
         <View style={styles.scoring}>
          <Text style={styles.court}>
            Streak Score
          </Text>
          <Text style={styles.points}>
            {highscore}
          </Text>
        </View>
        <TouchableOpacity onPress={this.helpPressed} style={styles.overlook}>
          <Overlook data={this.state} helpPressed={this.helpPressed} text="Rules" />
        </TouchableOpacity>
      <View style={styles.game}>
         <IntroRow texts={texts1} />
         <IntroRow texts={texts2} />
         <IntroRow texts={texts3} />
       </View>
       <TouchableOpacity style={styles.button} onPress={() => this.courtButtonPressed()} >
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
    let newCardStyle = null
    if (animation) {
      if (animation.animationDirection === "east") {
        newCardStyle = {position: 'absolute', left: 0 + ( animation.animationP * cardw), top: 0}
      } else if (animation.animationDirection === "west") {
        newCardStyle = {position: 'absolute', left: 0 - (animation.animationP * cardw),  top: 0}
      } else if (animation.animationDirection === "north") {
        newCardStyle = {position: 'absolute', left: 0,  top: 0 - (animation.animationP * cardh)}
      } else if (animation.animationDirection === "south") {
        newCardStyle = {position: 'absolute', left: 0,  top: 0 + (animation.animationP * cardh)}
      }
    }
    const newCardSuit = Card.suit[newCard.suit]
    
    const color = Card.color[newCard.suit]
    const newCardTextStyle = {color: color,
    fontSize: 50, fontWeight: 'bold', fontFamily: 'blackchancery'}

    let points = this.calculateScore(streaks)

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.showDiscard} style={styles.topRow}>
          <Text style={newCardTextStyle}>
            {newCard.value.toUpperCase()}{newCardSuit}
          </Text>
        </TouchableOpacity>
        <View style={styles.scoring}>
          <Text style={styles.court}>
            Court Score
          </Text>
          <Text style={styles.points}>
            {points}
          </Text>
        </View>
        <TouchableOpacity onPress={this.helpPressed} style={styles.overlook}>
          <Overlook data={this.state} helpPressed={() => {}} />
        </TouchableOpacity>
     <View style={styles.game}>
      {rows}
     </View>
     {won && won > 0 && <TouchableOpacity style={styles.button} onPress={() => this.resetPressed()} >
            <Text style={styles.text}>
              TRIUMPH
            </Text>
         </TouchableOpacity>}
    {won === -1 && <TouchableOpacity style={styles.button} onPress={() => this.resetPressed()} >
            <Text style={styles.text}>
              RUIN
            </Text>
         </TouchableOpacity>}
    </View>
    )
  }
}

const styles = StyleSheet.create({
  overlook: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scoring: {
    backgroundColor: 'white',
    position: 'absolute',
    left: cardw,
    right: cardw,
    top: 20,
    width: cardw,
    height: cardh,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  court: {
    fontFamily: 'blackchancery',
    fontSize: 20
  },
  points: {
    fontFamily: 'blackchancery',
    marginTop: cardh / 4,
    fontSize: 22,
    borderWidth: 1,
    borderColor: '#fff',
  },
  topRow: {
    top: 20,
    left: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: cardw,
    height: cardh,
    overflow: 'hidden'
  },
  game: {
    justifyContent: 'flex-end',
    height: cardh * 3,
    overflow: 'hidden',
    marginBottom: 24
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
  },
  button: {
    position: 'absolute',
    bottom: 0
  },
  discard: {
    flex: 1,
    margin: 40,
    backgroundColor: 'white'
  }
});
