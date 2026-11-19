const demoLima = [
  {
    id: 'p1',
    nombre: 'Parque El Bosque',
    direccion: 'Av. Del Ejército s/n, Miraflores',
    tipo: 'parque',
    rating: 4.5,
    horario: 'Todos los días 6:00–22:00',
    telefono: null,
    distanciaKm: 0.4,
    lat: -12.1219,
    lng: -77.0402,
  },
  {
    id: 'p2',
    nombre: 'Parque Las Palmeras',
    direccion: 'Calle Los Robles 3, San Borja',
    tipo: 'parque',
    rating: 4.7,
    horario: 'Todos los días 5:00–23:00',
    telefono: null,
    distanciaKm: 0.6,
    lat: -12.1088,
    lng: -77.0021,
  },
  {
    id: 'v1',
    nombre: 'Clínica Veterinaria San Marcos',
    direccion: 'Av. Los Pinos 234, Miraflores',
    tipo: 'veterinaria',
    rating: 4.8,
    horario: 'Lun–Sáb 8:00–20:00',
    telefono: '+51 1 445-7890',
    distanciaKm: 0.8,
    lat: -12.1194,
    lng: -77.0288,
  },
  {
    id: 'g1',
    nombre: 'PetStyle Grooming',
    direccion: 'Calle Las Flores 12, Miraflores',
    tipo: 'peluqueria',
    rating: 4.9,
    horario: 'Lun–Sáb 9:00–19:00',
    telefono: '+51 1 445-2211',
    distanciaKm: 1.1,
    lat: -12.1171,
    lng: -77.0315,
  },
  {
    id: 't1',
    nombre: 'Mundo Mascota',
    direccion: 'Av. Benavides 1180, Miraflores',
    tipo: 'tienda',
    rating: 4.4,
    horario: 'Todos los días 9:00–21:00',
    telefono: '+51 1 242-0090',
    distanciaKm: 1.4,
    lat: -12.1256,
    lng: -77.0271,
  },
];

const urlBase = (process.env.EXPO_PUBLIC_URL_API_LUGARES || 'http://localhost:8787').replace(/\/$/, '');

export async function pedirLugaresCercanos({ latitud, longitud, filtro }) {
  try {
    const params = new URLSearchParams({
      lat: String(latitud),
      lng: String(longitud),
      tipo: filtro || 'todos',
    });
    const respuesta = await fetch(`${urlBase}/api/lugares?${params.toString()}`);
    if (!respuesta.ok) throw new Error('servidor');
    const cuerpo = await respuesta.json();
    return cuerpo.lugares || [];
  } catch {
    if (!filtro || filtro === 'todos') return demoLima;
    return demoLima.filter((lugar) => lugar.tipo === filtro);
  }
}
