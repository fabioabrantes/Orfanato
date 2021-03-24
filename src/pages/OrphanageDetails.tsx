import React,{useEffect,useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions,Image, TouchableOpacity, Linking} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Feather,FontAwesome} from '@expo/vector-icons';
import mapMarker from '../images/map-marker.png';
import { RectButton } from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';

import api from '../services/api';
import { AppLoading } from 'expo';

interface ParamsId{
  id:number;
}

interface ImageUrl{
  id:number;
  url:string;
}

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images:Array<ImageUrl> 
}

const OrphanageDetails: React.FC = () => {
 const route = useRoute();
 const paramsId = route.params as ParamsId;

 const [orphanage, setOrphanage] = useState<Orphanage>();

 useEffect(()=>{
   api.get(`orphanages/${paramsId.id}`).then(response=>{
    setOrphanage(response.data);
   })
 },[paramsId.id]);

 if(!orphanage){
   return <AppLoading />
 }

 function handleOpenGoogleMapsRoute(){
   Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`);
 }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagesContainer}>
        <ScrollView  horizontal pagingEnabled>
          {orphanage.images.map(image=>{
            return (
              <Image key={image.id} source={{uri:image.url}} style={styles.image}/>
            )
          })}
        </ScrollView>

      </View>

      <View style={styles.detailOrphanageContainer}>

        <Text style={styles.title}>{orphanage.name}</Text>
        <Text style={styles.description}>{orphanage.about}</Text>
        
        <View style={styles.mapContainer}>
          <MapView 
              initialRegion={{
                latitude:-6.5205485,
                longitude:-38.4155765,
                latitudeDelta:0.008,
                longitudeDelta:0.008,
              }} 
              zoomEnabled={false}
              pitchEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              style={styles.mapStyle}
            >
              <Marker 
                icon={mapMarker}
                coordinate={{ 
                  latitude:orphanage.latitude,
                  longitude:orphanage.longitude,
                }}
              />
            </MapView>
            
            <TouchableOpacity onPress={handleOpenGoogleMapsRoute} style={styles.routesContainer}>
              <Text style={styles.routesText}> ver rotas no google maps</Text>
            </TouchableOpacity>
           
           </View> 

      </View>

      <View style={styles.separator}/>

      <Text style={styles.title}>Instruções para visitar</Text>
      <Text style={styles.description}>{orphanage.instructions}</Text>
      
      <View style={styles.scheduleContainer}>
        <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
          <Feather name="clock" size={40} color="#2ab5d1"/>
          <Text 
            style={[styles.scheduleItemText, styles.scheduleItemTextBlue]}
          > 
            Segunda à sexta {orphanage.opening_hours}
          </Text>
        </View>
       
       {orphanage.open_on_weekends? (
           <View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
              <Feather name="clock" size={40} color="#2ab5d1"/>
              <Text 
                style={[styles.scheduleItemText, styles.scheduleItemTextGreen]}
              > 
                Atendemos no final de semana
              </Text>
          </View>

       ):(
        <View style={[styles.scheduleItem, styles.scheduleItemRed]}>
            <Feather name="clock" size={40} color="#ff669d"/>
              <Text 
                style={[styles.scheduleItemText, styles.scheduleItemTextRed]}
              > 
                  Atendemos no final de semana
              </Text>
          </View>
       
       )}
        
      </View>
      <RectButton style={styles.contactButton} onPress={()=>{}}>
        <FontAwesome name="whatsapp" size={24} color="#fff"/>
        <Text style={styles.contactButtonText}> Entrar em contato</Text>
      </RectButton>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal:12
  },

  imagesContainer: {
    height: 240,
  },

  image: {
    width: Dimensions.get('window').width,
    height: 240,
    resizeMode: 'cover',
  },

  detailOrphanageContainer: {
    padding: 24,
  },

  title: {
    color: '#4D6F80',
    fontSize: 30,
    fontFamily: 'Nunito_700Bold',
  },

  description: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#5c8599',
    lineHeight: 24,
    marginTop: 16,
  },

  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: '#B3DAE2',
    marginTop: 40,
    backgroundColor: '#E6F7FB',
  },

  mapStyle: {
    width: '100%',
    height: 150,
  },

  routesContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3DAE2',
  },

  routesText: {
    fontFamily: 'Nunito_700Bold',
    color: '#0089a5'
  },

  separator: {
    height: 0.8,
    width: '100%',
    backgroundColor: '#D3E2E6',
    marginVertical: 30,
  },

  scheduleContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  scheduleItem: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },

  scheduleItemBlue: {
    backgroundColor: '#E6F7FB',
    borderColor: '#B3DAE2',
    
  },

  scheduleItemGreen: {
    backgroundColor: '#EDFFF6',
    borderColor: '#A1E9C5',
    
  },

  scheduleItemRed: {
    backgroundColor: '#fef6f9',
    borderColor: '#ffbcd4',
    
  },

  scheduleItemText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
  },

  scheduleItemTextBlue: {
    color: '#5C8599'
  },

  scheduleItemTextGreen: {
    color: '#37C77F'
  },

  scheduleItemTextRed: {
    color: '#ff669d'
  },

  contactButton: {
    backgroundColor: '#3CDC8C',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 40,
    marginBottom:40,
  },

  contactButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFF',
    fontSize: 16,
    marginLeft: 16,
  }
});

export default OrphanageDetails;