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

export const getLocalHora = (date) => {
  const fechaUTC = new Date(date);
  const opciones = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const fechaLocal = fechaUTC.toLocaleDateString("es-PE", opciones);
  return fechaLocal;
};

export const searchArray = (valor, tipo) => {
  for (let i = 0; i < tipo.length; i++) {
    if (tipo[i].value === valor.toString()) {
      return tipo[i].label;
    }
  }
  return "No se encontró el valor";
};
