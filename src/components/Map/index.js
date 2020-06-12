import React, { Component, Fragment } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Image } from 'react-native';
import { getPixelSize } from '../../utils';
import Geocoder from 'react-native-geocoding';

import Search from '../Search';
import Directions from '../Directions';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import { 
    Back,
    LocationBox, 
    LocationText, 
    LocationTimeBox, 
    LocationTimeText, 
    LocationTimeTextSmall
} from './styles';

import Details from '../Details';

Geocoder.init('SUA_KEY_DO_GOOGLE_APIS');

export default class Map extends Component {

    state = {
        region: null,
        destination: null,
        duration: null,
        nameLocation: null
    }

    async componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                const response = await Geocoder.from({ latitude, longitude });
                const address = response.results[0].formatted_address;
                const nameLocation = address.substring(0, address.indexOf(','));

                this.setState({ 
                    nameLocation,
                    region: {
                        latitude,
                        longitude,
                        longitudeDelta: 0.0143,
                        latitudeDelta: 0.0143
                    }
                 });
            },
            () => {},
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000
            }
        )
    }

    handleBack = () => {
        this.setState({ destination: null });
    }

    handlerLocationSelected = (data, { geometry }) => {
        const { location: { lat: latitude, lng: longitude } } = geometry;

        this.setState({
            destination: {
                latitude,
                longitude,
                title: data.structured_formatting.main_text
            },
        });
    }

    render(){
        const { region, destination, duration, nameLocation } = this.state;

        return (
            <View style={styles.conteiner}>
                <MapView 
                    style={styles.map}
                    region={region}
                    showsUserLocation
                    loadingEnabled
                    ref={ el => this.MapView = el }
                >
                    { destination && (
                        <Fragment>
                            <Directions
                                origin={region}
                                destination={destination}
                                onReady={result => {
                                    this.setState({ duration: Math.floor(result.duration) });

                                    this.MapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: getPixelSize(50),
                                            left: getPixelSize(50),
                                            top: getPixelSize(50),
                                            bottom: getPixelSize(350)
                                        }
                                    })
                                }}
                            />

                            <Marker
                                coordinate={destination} 
                                anchor={{ x: 0, y: 0 }} 
                                image={markerImage}

                            >
                                <LocationBox>
                                    <LocationText>{ destination.title }</LocationText>
                                </LocationBox>
                            </Marker>

                            <Marker
                                coordinate={region} 
                                anchor={{ x: 0, y: 0 }} 
                                image={markerImage}

                            >
                                <LocationBox>
                                    <LocationTimeBox>
                                        <LocationTimeText>{duration}</LocationTimeText>
                                        <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                                    </LocationTimeBox>
                                    <LocationText>{nameLocation}</LocationText>
                                </LocationBox>
                            </Marker>
                        </Fragment>
                        
                    ) }
                </MapView>
                    
                
                { destination ? (
                    <Fragment>
                        <Back onPress={this.handleBack}>
                            <Image source={backImage} />
                        </Back>
                        <Details />
                    </Fragment>
                 ) : (
                 <Search onLocationSelected={this.handlerLocationSelected} /> 
                 )
                }
            </View>
        );
    }
    
};

const styles = StyleSheet.create({
    conteiner: {
        flex: 1
    },
    map: {
        flex: 1
    }
});