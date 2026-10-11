import React from 'react';
import { Switch } from 'react-native';

export default function Interruptor({ valor, onCambio }) {
  return (
    <Switch
      value={valor}
      onValueChange={onCambio}
      trackColor={{ false: '#d9e0dc', true: '#7dcfbf' }}
      thumbColor={valor ? '#2b7a6d' : '#f4f4f4'}
    />
  );
}
