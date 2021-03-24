import React,{useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput, 
  TouchableOpacity, 
  View, 
  Switch, 
  StyleSheet,
  Image} from 'react-native';
import {Feather} from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import {useRoute, useNavigation} from '@react-navigation/native';
import * as ImagePicker  from 'expo-image-picker';
import api from '../../services/api';
// import { Container } from './styles';

interface Positions{
  latitude:number; 
  longitude: number;
}
interface ParamsPositions {
  position: Positions;
 
}


const OrphanageData: React.FC = () => {
  const route = useRoute();
  const navigation =useNavigation();

  const paramsPosition = route.params as ParamsPositions;
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [imagesURI, setImagesURI] = useState<string[]>([]);


  async function handleCreateOrphanage(){
    const {latitude,longitude} = paramsPosition.position;

    // estamos usando o formdata em vez no formato json. pois temos arquivos de imagens
    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    
    imagesURI.forEach((imageURI, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: imageURI,
      } as any); // por que não tem formato definido. problema do react native que não tem o name da imagem
    });

    await api.post('orphanages',data);
    navigation.navigate('orphanagesMap');

  }

  //https://www.npmjs.com/package/expo-image-picker
  async function hanldeSelectImages() {
    // tenho acesso a galeria de fotos e não a câmera
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    /* console.log(status); */

    if(status !== 'granted'){// granted é quando o usuário deu permissão
      alert('Eita, precisamos de acesso às suas fotos...');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // permite ao usuario editar a imagem (crop), antes de subir o app
      allowsEditing: true,
      quality: 1,
      //quero apensas imagems e não vídeo tb
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    /* console.log(result); */

    if(result.cancelled) { // se cancelou o upload da imagem
      return;
    }

    const { uri } = result;
    // questão do conceito de imutabilidade. sempre que uma imagem for adicionado, 
    //temos que copiar as imagens que tinha antes no array. 
    //se não vai apagar na próxima renderização. pois começa sempre do zero
    setImagesURI([...imagesURI, uri]);
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dados</Text>
      
      <Text style={styles.label}>Nome</Text>
      <TextInput 
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput 
        multiline 
        style={[styles.input,{height:110}]}
        value={about}
        onChangeText={setAbout}
      />

      <Text style={styles.label}>Whatsapp</Text>
      <TextInput style={styles.input}/>

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.uploadedImageContainer}>
        {imagesURI.map(imgUri =>{
          return (
            <Image 
              key={imgUri} 
              source={{uri:imgUri}} 
              style={styles.uploadedImage} 
          />
          );
        })}
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={hanldeSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6"/>
      </TouchableOpacity>


      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput 
        multiline 
        style={[styles.input,{height:110}]}
        value={instructions}
        onChangeText={setInstructions}
      />

      <Text style={styles.label}>Horário de visitas</Text>
      <TextInput 
        style={styles.input}
        value={opening_hours}
        onChangeText={setOpeningHours}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label }>Atende no final de semana?</Text>
        <Switch 
          thumbColor="#fff"
          trackColor={{false:'#ccc', true:'#39cc83'}}
          value={open_on_weekends}
          onValueChange={setOpenOnWeekends}
        />
      </View>
      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginHorizontal:12,
   
  },
  title:{
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },
  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  uploadedImageContainer:{
    flexDirection:'row',
  },
  uploadedImage:{
    width:64,
    height:64,
    borderRadius:20,
    marginBottom:32,
    marginRight:8

  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
    marginBottom:12
  },
  nextButtonText:{
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }

})

export default OrphanageData;