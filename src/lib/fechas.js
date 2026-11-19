export function fechaHoyLocal() {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function fechaEsValida(valor) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor || '');
  if (!coincidencia) return false;
  const [, anio, mes, dia] = coincidencia.map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
}

export function horaEsValida(valor) {
  const coincidencia = /^(\d{2}):(\d{2})$/.exec(valor || '');
  if (!coincidencia) return false;
  const [, horas, minutos] = coincidencia.map(Number);
  return horas <= 23 && minutos <= 59;
}