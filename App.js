import './global.css';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CuidadorProvider } from './src/estado/CuidadorContext';
import Navegacion from './src/navegacion/Navegacion';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CuidadorProvider>
          <Navegacion />
        </CuidadorProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
