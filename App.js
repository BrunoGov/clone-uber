import React from 'react';
// import MapView from 'react-native-maps';
import ScreenMap from './src';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenMap />
    </>
  )
}