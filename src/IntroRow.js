import React from 'react'
import {Dimensions, View, Text, StyleSheet} from 'react-native'
import IntroCard from './IntroCard'
const w = Dimensions.get('window').width

export default class IntroRow extends React.Component {
	render() {
		const {texts} = this.props
		return (
			<View style={styles.container}>
				<IntroCard data={texts[0]} />
				<IntroCard data={texts[1]} />
				<IntroCard data={texts[2]} />
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