import React from 'react'
import {Dimensions, View, Text, Image, StyleSheet} from 'react-native'
import Images from '../assets'
const w = Dimensions.get('window').width
const h = Dimensions.get('window').height
const cardw = (w / 3)
const cardh = h / 5
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export default class Card extends React.Component {
onSwipe(gestureName, gestureState) {
    const {x, y, onSwipe} = this.props
    console.log(gestureName);
    console.log(gestureState);
    const { dx, dy} = gestureState;
    console.log(`${dx} ${dy}`)

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
		const {data, animation} = this.props
		const {suit, value, card2} = data
		let suitName = {"D": "diamonds", "H" : "hearts", "C": "clubs", "S": "spades"}[suit]
		let p = `${value}_of_${suitName}`

    let p2 = null
    if (card2) {
      const suitName2 = {"D": "diamonds", "H" : "hearts", "C": "clubs", "S": "spades"}[card2.suit]
      p2 = `${card2.value}_of_${suitName2}`
    }

    let animationDirection = null
    let animationP = 0
    console.log("My animation" + animation)
    console.log("My card2" + card2)
    if (animation && card2) {
      animationDirection = animation.animationDirection
      animationP = animation.animationP
      console.log("Animation" + animationP)
    }

    let imageStyle1 = styles.image
    let imageStyle2 = imageStyle1
    if (animationP) {
      imageStyle1 = {...imageStyle1, marginLeft: cardw * 2 * animationP}
      imageStyle2 = {...imageStyle2, marginLeft: cardw * 2 * (1 - animationP)}
    }

		const config = {
      velocityThreshold: 0.0,
      directionalOffsetThreshold: 80
    };

    let containerStyle = {...styles.container, flexDirection: 'row'}

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
        {p2 && <Image
          resizeMode='contain'
          style={imageStyle2}
          source={Images[p2]}
        />}
				</View>
			</GestureRecognizer>
		)
	}
}

const styles = StyleSheet.create({
  text: {
    color: '#fff'
  },
  image: {
  	width: cardw,
  	height: cardh,
    overflow: 'hidden'
  },
  container: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	width: cardw,
  	height: cardh,
    overflow: 'hidden'
  }
});