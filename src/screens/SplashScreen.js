import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 5000); // 2 seconds

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')} // change path/name if needed
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.mainText}>Bhairavkalike Namostuthe</Text>
      <Text style={styles.subText}>Made with love for MAA 💗💗</Text>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  mainText: {
    fontSize: 22,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});
