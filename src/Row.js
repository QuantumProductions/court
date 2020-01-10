import React from 'react'
import {Dimensions, View, Text, StyleSheet} from 'react-native'
import Card from './Card'
const w = Dimensions.get('window').width

export default class Row extends React.Component {
	render() {
		const {cards, y, onSwipe, animation} = this.props
		return (
			<View style={styles.container}>
				<Card x={0} y={y} data={cards[0]} onSwipe={onSwipe} animation={animation}/>
				<Card x={1} y={y} data={cards[1]} onSwipe={onSwipe} animation={animation}/>
				<Card x={2} y={y} data={cards[2]} onSwipe={onSwipe} animation={animation}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: w,
	}
})