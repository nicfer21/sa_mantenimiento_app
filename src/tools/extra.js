export const getLocalDate = (date) => {
  const fechaUTC = new Date(date);
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const fechaLocal = fechaUTC.toLocaleDateString("es-PE", opciones);
  return fechaLocal;
};
