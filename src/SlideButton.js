import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SlideButton extends React.Component {
	render() {
		return (
			<View style={styles.container}>
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: 50,
    height: 50
  },
});
