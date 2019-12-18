import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import Images from '../assets'


export default class Card extends React.Component {
	render() {
		const {suit, value} = this.props
		let suitName = {"D": "diamonds", "H" : "hearts", "C": "clubs", "S": "spades"}[suit]
		let p = `${value}_of_${suitName}`
		return (
			<Image
				style={{width: 65, height: 100}}
				source={Images[p]}
			/>
		)
	}
}

const styles = StyleSheet.create({
  text: {
    color: '#fff'
  }
});