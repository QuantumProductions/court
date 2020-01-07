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
		const {data} = this.props
		const {suit, value} = data
		let suitName = {"D": "diamonds", "H" : "hearts", "C": "clubs", "S": "spades"}[suit]
		let p = `${value}_of_${suitName}`

		const config = {
      velocityThreshold: 0.0,
      directionalOffsetThreshold: 80
    };

		return (
			<GestureRecognizer
        config={config}
        style={styles.swiper}
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        >
				<View style={styles.container}>
				<Image
          resizeMode='contain'
					style={styles.image}
					source={Images[p]}
				/>
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
  	height: cardh
  },
  container: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	width: cardw,
  	height: cardh,
  }
});