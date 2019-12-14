import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export default class Card extends React.Component {
	render() {
		const {suit, value} = this.props
		return (
			<Text style={styles.text}>
				{suit} {value}
			</Text>
		)
	}
}


const styles = StyleSheet.create({
  text: {
    color: '#fff'
  }
});