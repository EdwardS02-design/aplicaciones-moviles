import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { hayNube, supabase } from '../lib/supabase';
import { subirFotoMascota } from '../lib/fotos';
import {
  cuentaLocalActiva,
  entrarCuentaLocal,
  registrarCuentaLocal,
  guardarCuentaLocal,
  cerrarSesionLocal,
} from '../lib/cuentasLocales';
import { coloresFicha } from '../constantes/catalogo';

const preferenciasDemo = {
  recordatorios: true,
  avisosCitas: true,
  alertaVacunas: true,
  resumenSemanal: false,
  modoOscuro: false,
  idioma: 'es-PE',
  unidadPeso: 'kg',
};

const CuidadorContext = createContext(null);

function idNuevo() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function filaMascota(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    categoria: fila.categoria,
    raza: fila.raza,
    edadAnios: Number(fila.edad_anios),
    pesoKg: Number(fila.peso_kg),
    fotoUrl: fila.foto_url,
    colorFicha: fila.color_ficha,
  };
}

function filaCita(fila) {
  return {
    id: fila.id,
    mascotaId: fila.mascota_id,
    tipo: fila.tipo,
    titulo: fila.titulo,
    lugar: fila.lugar,
    fecha: fila.fecha,
    hora: fila.hora,
  };
}

function filaActividad(fila) {
  return {
    id: fila.id,
    mascotaId: fila.mascota_id,
    tipo: fila.tipo,
    titulo: fila.titulo,
    hora: fila.hora,
    duracionMin: fila.duracion_min,
    fecha: fila.fecha,
  };
}

const perfilVacio = { nombre: '', correo: '', ciudad: 'Lima, Perú' };

export function CuidadorProvider({ children }) {
  const [cargando, setCargando] = useState(true);
  const [sesion, setSesion] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [perfil, setPerfil] = useState(perfilVacio);
  const [preferencias, setPreferencias] = useState(preferenciasDemo);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    arrancar();
  }, []);

  function aplicarCuentaLocal(cuenta) {
    setSesion({ local: true, user: { id: cuenta.id, email: cuenta.correo } });
    setPerfil({
      nombre: cuenta.nombre,
      correo: cuenta.correo,
      ciudad: cuenta.ciudad || 'Lima, Perú',
    });
    setMascotas(cuenta.mascotas || []);
    setCitas(cuenta.citas || []);
    setActividades(cuenta.actividades || []);
    setPreferencias(cuenta.preferencias || preferenciasDemo);
  }

  async function persistirLocal(extra = {}) {
    if (hayNube || !sesion?.user?.id) return;
    await guardarCuentaLocal({
      id: sesion.user.id,
      nombre: extra.perfil?.nombre ?? perfil.nombre,
      correo: extra.perfil?.correo ?? perfil.correo,
      ciudad: extra.perfil?.ciudad ?? perfil.ciudad,
      mascotas: extra.mascotas ?? mascotas,
      citas: extra.citas ?? citas,
      actividades: extra.actividades ?? actividades,
      preferencias: extra.preferencias ?? preferencias,
    });
  }

  async function asegurarUsuarioNube(user, nombreVisible) {
    const nombre = nombreVisible || user.user_metadata?.nombre || user.email?.split('@')[0] || 'Cuidador';
    const { error } = await supabase.from('usuarios').upsert({
      id: user.id,
      nombre,
      correo: user.email,
    });
    if (error) {
      throw new Error(
        /usuarios|schema cache|relation/i.test(error.message)
          ? 'Falta ejecutar supabase/schema.sql en el SQL Editor de Supabase.'
          : error.message
      );
    }
    const { error: preferencesError } = await supabase.from('preferencias').upsert({ dueno_id: user.id });
    if (preferencesError) throw preferencesError;
  }

  async function arrancar() {
    try {
      if (hayNube && supabase) {
        const { data } = await supabase.auth.getSession();
        setSesion(data.session);
        if (data.session) {
          await asegurarUsuarioNube(data.session.user);
          await refrescarNube(data.session.user.id, data.session.user.email);
        }
        supabase.auth.onAuthStateChange(async (_evento, nuevaSesion) => {
          setSesion(nuevaSesion);
          if (!nuevaSesion) {
            setMascotas([]);
            setCitas([]);
            setActividades([]);
            setPerfil(perfilVacio);
            return;
          }
          try {
            await asegurarUsuarioNube(nuevaSesion.user);
            await refrescarNube(nuevaSesion.user.id, nuevaSesion.user.email);
          } catch (error) {
            console.error('No se pudieron cargar los datos sincronizados de PetCare.', error);
            setAviso('No se pudieron cargar los datos de tu cuenta. Comprueba tu conexión e inténtalo de nuevo.');
          }
        });
      } else {
        const cuenta = await cuentaLocalActiva();
        if (cuenta) aplicarCuentaLocal(cuenta);
      }
    } catch (error) {
      console.warn('No se pudo abrir la sesión', error.message);
      setAviso('No se pudieron cargar tus datos de cuenta. Comprueba la conexión o la configuración de Supabase.');
    } finally {
      setCargando(false);
    }
  }

  async function refrescarNube(duenoId, correo) {
    const respuestas = await Promise.all([
      supabase.from('usuarios').select('*').eq('id', duenoId).maybeSingle(),
      supabase.from('mascotas').select('*').eq('dueno_id', duenoId).order('creado_en'),
      supabase.from('citas').select('*').eq('dueno_id', duenoId).order('fecha'),
      supabase.from('actividades').select('*').eq('dueno_id', duenoId).order('fecha', { ascending: false }),
      supabase.from('preferencias').select('*').eq('dueno_id', duenoId).maybeSingle(),
    ]);
    const failed = respuestas.find((respuesta) => respuesta.error);
    if (failed) throw failed.error;
    const [
      { data: usuarioFila },
      { data: listaMascotas },
      { data: listaCitas },
      { data: listaActividades },
      { data: prefs },
    ] = respuestas;

    setPerfil({
      nombre: usuarioFila?.nombre || correo?.split('@')[0] || 'Cuidador',
      correo: usuarioFila?.correo || correo || '',
      ciudad: usuarioFila?.ciudad || 'Lima, Perú',
    });
    setMascotas((listaMascotas || []).map(filaMascota));
    setCitas((listaCitas || []).map(filaCita));
    setActividades((listaActividades || []).map(filaActividad));
    if (prefs) {
      setPreferencias({
        recordatorios: prefs.recordatorios,
        avisosCitas: prefs.avisos_citas,
        alertaVacunas: prefs.alerta_vacunas,
        resumenSemanal: prefs.resumen_semanal,
        modoOscuro: prefs.modo_oscuro,
        idioma: prefs.idioma,
        unidadPeso: prefs.unidad_peso,
      });
    }
  }

  async function entrar({ correo, clave }) {
    if (hayNube && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: clave,
      });
      if (error) throw error;
      if (!data.session?.user) throw new Error('No se pudo abrir la sesión.');
      await asegurarUsuarioNube(data.session.user);
      await refrescarNube(data.session.user.id, data.session.user.email);
      setSesion(data.session);
      return;
    }

    const cuenta = await entrarCuentaLocal({ correo, clave });
    aplicarCuentaLocal(cuenta);
  }

  async function registrarme({ nombre, correo, clave }) {
    if (hayNube && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: clave,
        options: { data: { nombre } },
      });
      if (error) throw error;

      if (!data.session) {
        throw new Error(
          'La cuenta se creó. Si no entras solo, desactiva "Confirm email" en Supabase (Authentication → Providers → Email) y vuelve a iniciar sesión.'
        );
      }

      await asegurarUsuarioNube(data.session.user, nombre);
      await refrescarNube(data.session.user.id, data.session.user.email);
      setSesion(data.session);
      setMascotas([]);
      setCitas([]);
      setActividades([]);
      setPerfil({ nombre, correo, ciudad: 'Lima, Perú' });
      return;
    }

    const cuenta = await registrarCuentaLocal({ nombre, correo, clave });
    aplicarCuentaLocal(cuenta);
  }

  async function salir() {
    if (hayNube && supabase) {
      await supabase.auth.signOut();
    } else {
      await cerrarSesionLocal();
    }
    setSesion(null);
    setMascotas([]);
    setCitas([]);
    setActividades([]);
    setPerfil(perfilVacio);
    setPreferencias(preferenciasDemo);
  }

  async function agregarMascota(datos) {
    const duenoId = sesion?.user?.id;
    const color = coloresFicha[mascotas.length % coloresFicha.length];
    let fotoUrl = datos.fotoUri;
    if (hayNube && duenoId && datos.fotoUri) {
      fotoUrl = await subirFotoMascota(duenoId, datos.fotoUri);
    }

    if (hayNube && supabase && duenoId) {
      const { data, error } = await supabase
        .from('mascotas')
        .insert({
          dueno_id: duenoId,
          nombre: datos.nombre,
          categoria: datos.categoria,
          raza: datos.raza,
          edad_anios: Number(datos.edadAnios),
          peso_kg: Number(datos.pesoKg),
          foto_url: fotoUrl,
          color_ficha: color,
        })
        .select()
        .single();
      if (error) throw error;
      setMascotas((prev) => [...prev, filaMascota(data)]);
      return;
    }

    const nueva = {
      id: idNuevo(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      raza: datos.raza,
      edadAnios: Number(datos.edadAnios),
      pesoKg: Number(datos.pesoKg),
      fotoUrl,
      colorFicha: color,
      ...(datos.ubicacion ? { ubicacion: datos.ubicacion } : {}),
    };
    const lista = [...mascotas, nueva];
    setMascotas(lista);
    await persistirLocal({ mascotas: lista });
  }

  async function importarMascotas(listaAnterior) {
    const disponibles = listaAnterior.filter((pet) => !mascotas.some(
      (actual) => actual.nombre.toLowerCase() === pet.nombre.toLowerCase()
        && actual.raza.toLowerCase() === pet.raza.toLowerCase(),
    ));
    if (disponibles.length === 0) return;

    const colorPorMascota = (indice) => coloresFicha[(mascotas.length + indice) % coloresFicha.length];
    if (hayNube && supabase && sesion?.user?.id) {
      const cargadas = [];
      for (let indice = 0; indice < disponibles.length; indice += 1) {
        const pet = disponibles[indice];
        let fotoUrl = pet.fotoUri;
        if (fotoUrl?.startsWith('file://')) fotoUrl = await subirFotoMascota(sesion.user.id, fotoUrl);
        const { data, error } = await supabase
          .from('mascotas')
          .insert({
            dueno_id: sesion.user.id,
            nombre: pet.nombre,
            categoria: pet.categoria,
            raza: pet.raza,
            edad_anios: Number(pet.edadAnios),
            peso_kg: Number(pet.pesoKg),
            foto_url: fotoUrl || null,
            color_ficha: colorPorMascota(indice),
          })
          .select()
          .single();
        if (error) throw error;
        cargadas.push({
          ...filaMascota(data),
          ...(pet.ubicacion ? { ubicacion: pet.ubicacion } : {}),
        });
      }
      setMascotas((actuales) => [...actuales, ...cargadas]);
      return;
    }

    const importadas = disponibles.map((pet, indice) => ({
      id: idNuevo(),
      ...pet,
      colorFicha: colorPorMascota(indice),
    }));
    const nuevas = [...mascotas, ...importadas];
    setMascotas(nuevas);
    await persistirLocal({ mascotas: nuevas });
  }

  async function actualizarMascota(mascotaId, datos) {
    const duenoId = sesion?.user?.id;
    let fotoUrl = datos.fotoUri;
    if (hayNube && supabase && duenoId && fotoUrl?.startsWith('file://')) {
      fotoUrl = await subirFotoMascota(duenoId, fotoUrl);
    }

    const cambios = {
      nombre: datos.nombre,
      categoria: datos.categoria,
      raza: datos.raza,
      edadAnios: Number(datos.edadAnios),
      pesoKg: Number(datos.pesoKg),
      fotoUrl: fotoUrl || null,
      ...(datos.ubicacion ? { ubicacion: datos.ubicacion } : {}),
    };

    if (hayNube && supabase && duenoId) {
      const { data, error } = await supabase
        .from('mascotas')
        .update({
          nombre: cambios.nombre,
          categoria: cambios.categoria,
          raza: cambios.raza,
          edad_anios: cambios.edadAnios,
          peso_kg: cambios.pesoKg,
          foto_url: cambios.fotoUrl,
        })
        .eq('id', mascotaId)
        .eq('dueno_id', duenoId)
        .select()
        .single();
      if (error) throw error;
      setMascotas((actuales) =>
        actuales.map((mascota) =>
          mascota.id === mascotaId
            ? { ...filaMascota(data), ...(cambios.ubicacion ? { ubicacion: cambios.ubicacion } : {}) }
            : mascota,
        ),
      );
      return;
    }

    const lista = mascotas.map((mascota) =>
      mascota.id === mascotaId ? { ...mascota, ...cambios } : mascota,
    );
    setMascotas(lista);
    await persistirLocal({ mascotas: lista });
  }

  async function agregarCita(datos) {
    const duenoId = sesion?.user?.id;
    if (hayNube && supabase && duenoId) {
      const { data, error } = await supabase
        .from('citas')
        .insert({
          dueno_id: duenoId,
          mascota_id: datos.mascotaId,
          tipo: datos.tipo,
          titulo: datos.titulo,
          lugar: datos.lugar,
          fecha: datos.fecha,
          hora: datos.hora,
        })
        .select()
        .single();
      if (error) throw error;
      setCitas((prev) => [...prev, filaCita(data)]);
      return;
    }

    const nueva = { id: idNuevo(), ...datos };
    const lista = [...citas, nueva];
    setCitas(lista);
    await persistirLocal({ citas: lista });
  }

  async function agregarActividad(datos) {
    const duenoId = sesion?.user?.id;
    if (hayNube && supabase && duenoId) {
      const { data, error } = await supabase
        .from('actividades')
        .insert({
          dueno_id: duenoId,
          mascota_id: datos.mascotaId,
          tipo: datos.tipo,
          titulo: datos.titulo,
          hora: datos.hora,
          duracion_min: datos.duracionMin ? Number(datos.duracionMin) : null,
          fecha: datos.fecha,
        })
        .select()
        .single();
      if (error) throw error;
      setActividades((prev) => [filaActividad(data), ...prev]);
      return;
    }

    const nueva = {
      id: idNuevo(),
      ...datos,
      duracionMin: datos.duracionMin ? Number(datos.duracionMin) : null,
    };
    const lista = [nueva, ...actividades];
    setActividades(lista);
    await persistirLocal({ actividades: lista });
  }

  async function actualizarPreferencias(cambios) {
    const mezclado = { ...preferencias, ...cambios };
    const duenoId = sesion?.user?.id;
    if (hayNube && supabase && duenoId) {
      const { error } = await supabase.from('preferencias').upsert({
        dueno_id: duenoId,
        recordatorios: mezclado.recordatorios,
        avisos_citas: mezclado.avisosCitas,
        alerta_vacunas: mezclado.alertaVacunas,
        resumen_semanal: mezclado.resumenSemanal,
        modo_oscuro: mezclado.modoOscuro,
        idioma: mezclado.idioma,
        unidad_peso: mezclado.unidadPeso,
      });
      if (error) throw error;
      setPreferencias(mezclado);
      return;
    }
    setPreferencias(mezclado);
    await persistirLocal({ preferencias: mezclado });
  }

  async function actualizarPerfil(cambios) {
    const mezclado = { ...perfil, ...cambios };
    const duenoId = sesion?.user?.id;
    if (hayNube && supabase && duenoId) {
      const { error } = await supabase
        .from('usuarios')
        .update({ nombre: mezclado.nombre, ciudad: mezclado.ciudad })
        .eq('id', duenoId);
      if (error) throw error;
      setPerfil(mezclado);
      return;
    }
    setPerfil(mezclado);
    await persistirLocal({ perfil: mezclado });
  }

  const proximaCitaDe = (mascotaId) => {
    const hoy = new Date().toISOString().slice(0, 10);
    return citas
      .filter((cita) => cita.mascotaId === mascotaId && cita.fecha >= hoy)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  };

  const valor = useMemo(
    () => ({
      cargando,
      sesion,
      perfil,
      mascotas,
      citas,
      actividades,
      preferencias,
      aviso,
      setAviso,
      hayNube,
      entrar,
      registrarme,
      salir,
      agregarMascota,
      importarMascotas,
      actualizarMascota,
      agregarCita,
      agregarActividad,
      actualizarPreferencias,
      actualizarPerfil,
      proximaCitaDe,
    }),
    [cargando, sesion, perfil, mascotas, citas, actividades, preferencias, aviso]
  );

  return <CuidadorContext.Provider value={valor}>{children}</CuidadorContext.Provider>;
}

export function useCuidador() {
  const ctx = useContext(CuidadorContext);
  if (!ctx) throw new Error('useCuidador debe usarse dentro de CuidadorProvider');
  return ctx;
}
