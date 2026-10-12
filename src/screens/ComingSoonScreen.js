import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../theme/colors';
import BottomNav from '../components/BottomNav';

export default function ComingSoonScreen({ label, icon, activeTab, onSelectTab }) {
  const [mapError, setMapError] = useState(false);
  const lat = -11.9945;
  const lon = -77.0622;
  const zoom = 16;
  const mapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #f3f5f3; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const plazaNorteCoord = [${lat}, ${lon}];
          const map = L.map('map', { zoomControl: false }).setView(plazaNorteCoord, ${zoom});
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          L.marker(plazaNorteCoord).addTo(map).bindPopup('<b>Plaza Norte</b>');
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.phoneFrame}>
        
        <View
          className={label === 'Lugares' ? 'flex-1 bg-[#f3f5f3]' : undefined}
          style={styles.content}
        >
          {label === 'Lugares' ? (
            mapError ? (
              <View className="flex-1 items-center justify-center gap-3 px-6">
                <Text className="text-center text-base text-[#64726d]">
                  No se pudo cargar el mapa de OpenStreetMap. Comprueba tu conexión a internet.
                </Text>
                <TouchableOpacity
                  className="rounded-xl bg-[#2b7a6d] px-5 py-3"
                  onPress={() => Linking.openURL(mapUrl)}
                >
                  <Text className="font-bold text-white">Abrir Plaza Norte en OpenStreetMap</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <WebView
                originWhitelist={['*']}
                source={{ html: mapHtml, baseUrl: 'https://www.openstreetmap.org' }}
                style={styles.mapa}
                javaScriptEnabled
                domStorageEnabled
                onLoadStart={() => setMapError(false)}
                startInLoadingState
                renderLoading={() => (
                  <View className="absolute inset-0 items-center justify-center bg-[#f3f5f3]">
                    <ActivityIndicator color="#2b7a6d" />
                  </View>
                )}
                onError={() => setMapError(true)}
              />
            )
          ) : (
            <View style={styles.centerContent}>
              <Text style={styles.icon}>{icon}</Text>
              <Text style={styles.title}>{label}</Text>
              <Text style={styles.subtitle}>Esta sección todavía no está lista. ¡Pronto!</Text>
            </View>
          )}
        </View>

        <BottomNav activeTab={activeTab} onSelectTab={onSelectTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDashboard, justifyContent: 'center', alignItems: 'center' },
  phoneFrame: {
    width: 390, maxWidth: '92%', height: '92%', backgroundColor: '#f3f5f3', borderRadius: 36,
    overflow: 'hidden', borderWidth: 1, borderColor: '#dfe6de',
  },
  content: { flex: 1 }, // Cambiado a flex: 1 para que el mapa o el contenido ocupen todo el espacio disponible
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textDark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  mapa: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});
