import React from 'react'
import {Dimensions, View, Text, TouchableOpacity, StyleSheet} from 'react-native'
const w = Dimensions.get('window').width
const h = Dimensions.get('window').height
const cardw = (w / 3)
const cardh = h / 5

export default class Overlook extends React.Component {
	render() {
		const {data, helpPressed, text} = this.props
		return (
				<View style={styles.container}>    
            <Text style={styles.text}>
              {text ? text : "Rules"}
            </Text>
				</View>
		)
	}
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'blackchancery'
  },
  help: {
    height: 44,
    width: cardw
  },
  container: {
    top: 20,
  	alignItems: 'center',
  	justifyContent: 'center',
  	width: cardw,
  	height: cardh,
    borderWidth: 1,
    borderColor: 'white'
  }
});