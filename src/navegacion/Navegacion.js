import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BarraInferior from '../components/BarraInferior';
import MascotasScreen from '../screens/MascotasScreen';
import AgendaScreen from '../screens/AgendaScreen';
import ActividadesScreen from '../screens/ActividadesScreen';
import LugaresScreen from '../screens/LugaresScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import { useCuidador } from '../estado/CuidadorContext';
import { ActivityIndicator, View } from 'react-native';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const tema = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#eef3ef' },
};

function Pestañas() {
  return (
    <Tabs.Navigator
      tabBar={(props) => <BarraInferior {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="Mascotas" component={MascotasScreen} />
      <Tabs.Screen name="Agenda" component={AgendaScreen} />
      <Tabs.Screen name="Actividades" component={ActividadesScreen} />
      <Tabs.Screen name="Lugares" component={LugaresScreen} />
      <Tabs.Screen name="Config" component={ConfiguracionScreen} />
    </Tabs.Navigator>
  );
}

function AppLogueada() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={Pestañas} />
      <Stack.Screen name="DetalleMascota" component={PetDetailScreen} />
    </Stack.Navigator>
  );
}

function Auth() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Registro" component={RegistroScreen} />
    </AuthStack.Navigator>
  );
}

export default function Navegacion() {
  const { sesion, cargando } = useCuidador();

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-fondo">
        <ActivityIndicator color="#5ebfae" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={tema}>
      {sesion ? <AppLogueada /> : <Auth />}
    </NavigationContainer>
  );
}
