import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/100' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>Elmer Zuluaga</Text>
        <Text style={styles.role}>Desarrollador de Software</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Proyecto:</Text>
          <Text style={styles.infoValue}>Aplicaciones Móviles</Text>
        </View>
      </View>

      <Button title="Volver al Inicio" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    elevation: 4,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  role: { fontSize: 14, color: '#007AFF', marginBottom: 16 },
  infoContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  infoLabel: { fontWeight: '600', color: '#555' },
  infoValue: { color: '#777' },
});