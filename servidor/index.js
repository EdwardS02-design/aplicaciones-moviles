const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const puerto = process.env.PORT || 8787;
const claveMaps = process.env.GOOGLE_MAPS_API_KEY || '';

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

const tiposGoogle = {
  parque: { type: 'park', keyword: 'parque' },
  veterinaria: { type: 'veterinary_care', keyword: 'veterinaria' },
  peluqueria: { type: 'pet_store', keyword: 'grooming peluqueria mascotas' },
  tienda: { type: 'pet_store', keyword: 'tienda mascotas' },
};

function distanciaKm(aLat, aLng, bLat, bLng) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 10) / 10;
}

function clasificar(types = [], keyword = '') {
  const t = types.join(' ').toLowerCase() + ' ' + keyword.toLowerCase();
  if (t.includes('park')) return 'parque';
  if (t.includes('veterinary')) return 'veterinaria';
  if (t.includes('groom') || t.includes('pelu')) return 'peluqueria';
  if (t.includes('pet_store') || t.includes('store')) return 'tienda';
  return 'otro';
}

async function buscarEnGoogle(lat, lng, filtro) {
  const grupos = filtro && filtro !== 'todos' ? [filtro] : ['parque', 'veterinaria', 'peluqueria', 'tienda'];
  const vistos = new Set();
  const resultados = [];

  for (const grupo of grupos) {
    const cfg = tiposGoogle[grupo];
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.set('location', `${lat},${lng}`);
    url.searchParams.set('radius', '4000');
    url.searchParams.set('type', cfg.type);
    url.searchParams.set('keyword', cfg.keyword);
    url.searchParams.set('language', 'es');
    url.searchParams.set('key', claveMaps);

    const resp = await fetch(url);
    const json = await resp.json();
    if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
      throw new Error(json.error_message || json.status);
    }

    for (const lugar of json.results || []) {
      if (vistos.has(lugar.place_id)) continue;
      vistos.add(lugar.place_id);
      const latL = lugar.geometry?.location?.lat;
      const lngL = lugar.geometry?.location?.lng;
      resultados.push({
        id: lugar.place_id,
        nombre: lugar.name,
        direccion: lugar.vicinity || lugar.formatted_address || '',
        tipo: clasificar(lugar.types, cfg.keyword),
        rating: lugar.rating || null,
        horario: lugar.opening_hours?.open_now ? 'Abierto ahora' : 'Horario no disponible',
        telefono: null,
        distanciaKm: distanciaKm(Number(lat), Number(lng), latL, lngL),
        lat: latL,
        lng: lngL,
      });
    }
  }

  return resultados.sort((a, b) => a.distanciaKm - b.distanciaKm);
}

app.get('/api/lugares', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const tipo = req.query.tipo || 'todos';

  try {
    if (!claveMaps) {
      const filtrados =
        tipo === 'todos' ? demoLima : demoLima.filter((l) => l.tipo === tipo);
      return res.json({ lugares: filtrados, fuente: 'demo' });
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'Faltan coordenadas' });
    }

    const lugares = await buscarEnGoogle(lat, lng, tipo);
    res.json({ lugares, fuente: 'google' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo consultar Google Maps' });
  }
});

app.get('/salud', (_req, res) => {
  res.json({ ok: true });
});

app.listen(puerto, '0.0.0.0', () => {
  console.log(`API de lugares en http://0.0.0.0:${puerto}`);
});
