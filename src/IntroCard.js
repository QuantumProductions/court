import React from 'react'
import {Dimensions, View, Text, StyleSheet} from 'react-native'
const w = Dimensions.get('window').width
const h = Dimensions.get('window').height
const cardw = (w / 3)
const cardh = h / 5

export default class IntroCard extends React.Component {
	render() {
		const {data} = this.props
		return (
				<View style={styles.container}>
			   <Text style={styles.text}>{data}</Text>
				</View>
		)
	}
}

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'blackchancery'
  },
  container: {
  	alignItems: 'center',
  	justifyContent: 'center',
  	width: cardw,
  	height: cardh,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#000'
  }
});