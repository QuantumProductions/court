import React from 'react'
import {Dimensions, View, Text, Image, StyleSheet} from 'react-native'
import Card from './Card'

const w = Dimensions.get('window').width

export default Row extends React.Component {
	render() {
		const {cards, y, onSwipe} = this.props
		return (
			<View style={styles.container}>
				<Card x={0} y={y} data={cards[0]} onSwipe={onSwipe} />
				<Card x={1} y={y} data={cards[1]} onSwipe={onSwipe} />
				<Card x={2} y={y} data={cards[2]} onSwipe={onSwipe} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: w,
		height: (w / 3) * 4
	}
})