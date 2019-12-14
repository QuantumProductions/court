import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Court from './src/Court'

export default function App() {
  return (
    <View style={styles.container}>
      <Court />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
