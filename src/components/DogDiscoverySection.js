import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import useDogImages from '../hooks/useDogImages';

function getBreedName(imageUrl) {
  const pathParts = imageUrl.split('/');
  const breed = pathParts[pathParts.length - 2];
  return breed ? breed.replace(/-/g, ' ') : 'Raza por descubrir';
}

export default function DogDiscoverySection() {
  const { images, isLoading, error, retry } = useDogImages();

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.title}>Descubre perros</Text>
          <Text style={styles.subtitle}>Imágenes de la API pública Dog CEO</Text>
        </View>
        {!isLoading && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Actualizar imágenes de perros"
            onPress={retry}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshText}>Actualizar</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.messageCard} accessibilityRole="progressbar">
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.messageText}>Cargando imágenes…</Text>
        </View>
      ) : error ? (
        <View style={styles.messageCard} accessibilityRole="alert">
          <Text style={styles.messageText}>{error}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={retry}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : images.length === 0 ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>La API no devolvió imágenes esta vez.</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={retry}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Volver a intentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageGrid}>
          {images.map((imageUrl) => (
            <View key={imageUrl} style={styles.imageCard}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                accessibilityLabel={`Perro de raza ${getBreedName(imageUrl)}`}
              />
              <Text numberOfLines={1} style={styles.breedName}>
                {getBreedName(imageUrl)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 8, marginBottom: 20 },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: '800', color: colors.textDark },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  refreshButton: {
    backgroundColor: '#eafaf5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  refreshText: { color: colors.brand, fontSize: 12, fontWeight: '700' },
  messageCard: {
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  messageText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  retryButton: {
    backgroundColor: '#eafaf5',
    borderRadius: 10,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  imageCard: {
    width: '48.5%',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 120, backgroundColor: '#eaf0eb' },
  breedName: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 9,
    textTransform: 'capitalize',
  },
});
