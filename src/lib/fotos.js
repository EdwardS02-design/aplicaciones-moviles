import { hayNube, supabase } from './supabase';

export async function subirFotoMascota(duenoId, archivoUri) {
  if (!hayNube || !supabase || !archivoUri) return archivoUri;

  const nombreArchivo = `${duenoId}/${Date.now()}.jpg`;
  const archivo = await fetch(archivoUri);
  const blob = await archivo.blob();

  const { error } = await supabase.storage
    .from('fotos-mascotas')
    .upload(nombreArchivo, blob, { upsert: true, contentType: 'image/jpeg' });

  if (error) {
    console.warn('No se pudo subir la foto, se guarda en el teléfono', error.message);
    return archivoUri;
  }

  const { data } = supabase.storage.from('fotos-mascotas').getPublicUrl(nombreArchivo);
  return data.publicUrl;
}
