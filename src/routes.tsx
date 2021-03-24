import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import OrphanagesMap from './pages/OrphanagesMap';
import OrphanagesDetails from './pages/OrphanageDetails';
import OrphanageData from './pages/CreateOrphanage/OrphanageData';
import SelectMapPosition from './pages/CreateOrphanage/SelectMapPosition';
import Header from './components/Header';

const {Navigator, Screen} = createStackNavigator();

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{headerShown:false,cardStyle:{backgroundColor: '#f2f3f5'} }}>
        <Screen name="OrphanagesMap" component={OrphanagesMap}/>
        <Screen  
          name="OrphanageDetails" 
          component={OrphanagesDetails}
          options={{
            headerShown:true,
            header: ()=> <Header title='Orfanato' showX ={false}/>
          }}
        />
        <Screen  
          name="SelectMapPosition" 
          component={SelectMapPosition}
          options={{
            headerShown:true,
            header: ()=> <Header title='Selecione no Mapa'/>
          }}
        />
        <Screen  
          name="OrphanageData" 
          component={OrphanageData}
          options={{
            headerShown:true,
            header: ()=> <Header title='Informe os dados'/>
          }}
        />
      </Navigator>

    </NavigationContainer>

  );
}

export default Routes;