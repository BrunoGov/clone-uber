import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination, origin, onReady }) => (
    <MapViewDirections
        destination={destination}
        origin={origin}
        onReady={onReady}
        apikey="SUA_KEY_DO_GOOGLE_APIS"
        strokeColor="#222"
        strokeWidth={3}
    />
);

export default Directions;