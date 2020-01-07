import React from 'react'
import {Dimensions, View, Text, Image, StyleSheet} from 'react-native'
import Images from '../assets'

const w = Dimensions.get('window').width

const cardw = (w / 3)
const cardh = cardw * 1.45
// const cardw = 100
// const cardh = 100
// const cardh = card 
export default class Card extends React.Component {
	render() {
		const {data} = this.props
		const {suit, value} = data
		let suitName = {"D": "diamonds", "H" : "hearts", "C": "clubs", "S": "spades"}[suit]
		let p = `${value}_of_${suitName}`
		return (
			<View style={styles.container}>
			<Image
				style={styles.image}
				source={Images[p]}
			/>
			</View>
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