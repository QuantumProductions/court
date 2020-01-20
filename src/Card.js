import React from 'react'
import {Dimensions, View, Text, Image, StyleSheet} from 'react-native'
import Images from '../assets'
const w = Dimensions.get('window').width
const h = Dimensions.get('window').height
const cardw = (w / 3)
const cardh = h / 5
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

class Card extends React.Component {
onSwipe(gestureName, gestureState) {
    const {x, y, onSwipe} = this.props
    // console.log(gestureName);
    // console.log(gestureState);
    const { dx, dy} = gestureState;
    // console.log(`${dx} ${dy}`)

    if (dx > 0) {
      if (dx > Math.abs(dy) * 5) {
        onSwipe(x, y, "east")
      }
    }

    if (dx < 0) {
      if (dx < -Math.abs(dy) * 5) {
			onSwipe(x, y, "west")
        return
      }
    }

    if (dy > 0) {
      if (dy > Math.abs(dx) * 5) {
				onSwipe(x, y, "south")
        return
      }
    }

    if (dy < 0) {
      if (dy < -Math.abs(dx) * 5) {
				onSwipe(x, y, "north")
        return
      }
    }
  }

	render() {
		const {data, animation, style} = this.props
		const {suit, value, card2} = data
    let p
    if (value === "z") {
      p = {r: 'red_joker', b: 'black_joker'}[suit]
    } else {
      let suitName = {"D": "diamonds", "H" : "hearts", "C": "clubs", "S": "spades"}[suit]
      p = `${value}_of_${suitName}`
    }
		

    let p2 = null
    let animationDirection = null
    let animationP = 0
    // console.log("My animation" + animation)
    // console.log("My card2" + card2)
    if (animation && card2) {
      animationDirection = animation.animationDirection
      animationP = animation.animationP
    }

    let imageStyle1 = styles.image
    let imageStyle2 = imageStyle1
    if (animationP) {
      if (card2) {
        const suitName2 = {"D": "diamonds", "H" : "hearts", "C": "clubs", "S": "spades"}[card2.suit]
        p2 = `${card2.value}_of_${suitName2}`
      }
      //east
      if (animationDirection === "east") {
        imageStyle1 = {...imageStyle1, left: cardw * animationP}
        imageStyle2 = {...imageStyle2, right: cardw * (1 - animationP)}
      } else if (animationDirection === "west") {
        imageStyle1 = {...imageStyle1, right: cardw * animationP}
        imageStyle2 = {...imageStyle2, left: cardw * (1 - animationP)}
      } else if (animationDirection === "south") {
        imageStyle1 = {...imageStyle1, top: cardh * animationP}
        imageStyle2 = {...imageStyle2, bottom: cardh * (1 - animationP)}
      } else if (animationDirection === "north") {
        imageStyle1 = {...imageStyle1, bottom: cardh * animationP}
        imageStyle2 = {...imageStyle2, top: cardh * (1 - animationP)}
      } 
    }

		const config = {
      velocityThreshold: 0.0,
      directionalOffsetThreshold: 80
    };

    let containerStyle
    if (style) {
      containerStyle = style
    }

		return (
			<GestureRecognizer
        config={config}
        style={styles.swiper}
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        >
				<View style={containerStyle}>
        <Image
          resizeMode='contain'
					style={imageStyle1}
					source={Images[p]}
				/>
				</View>
			</GestureRecognizer>
		)
	}

  static suit = {H: '♥', D: '♦', C: '♣', S: '♠', r: '?', b: '?'}
  static color = {H: 'red', D: 'red', C: 'black', S: 'black', r: 'red', b: 'black'}
}

export {Card, cardw, cardh}

const styles = StyleSheet.create({
  text: {
    color: '#fff'
  },
  image: {
    position: 'absolute',
  	width: cardw,
  	height: cardh,
    overflow: 'hidden'
  },
  container: {
  	justifyContent: 'center',
  	width: cardw,
  	height: cardh,
    overflow: 'hidden',
    flexDirection: 'column'
  }
});