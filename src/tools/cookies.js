export const setCookie = (valor, nombre = "token", horas = 168) => {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + horas * 60 * 60 * 1000);
  const fechaUTC = fecha.toString;
  document.cookie = `${nombre}=${valor}; expires=${fechaUTC}; path=/`;
};

export const getCookie = (nombre = "token") => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieNombre, cookieValor] = cookie.split("=");
    if (cookieNombre === nombre) {
      return decodeURIComponent(cookieValor);
    }
  }
  return null; // Retorna null si la cookie no se encuentra
};

export const updateCookie = (valor, nombre = "token", horas = 168) => {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + horas * 60 * 60 * 1000);
  const fechaUTC = fecha.toString;
  document.cookie = `${nombre}=${valor}; expires=${fechaUTC}; path=/`;
};

export const deleteCookie = (nombre = "token") => {
  const fechaExpiracionPasada = new Date(0);
  const fechaExpiracionUTC = fechaExpiracionPasada.toUTCString();
  document.cookie = `${nombre}=; expires=${fechaExpiracionUTC}; path=/`;
};

export const setSession = (valor, nombre = "token") => {
  sessionStorage.setItem(nombre, valor);
};

export const getSession = (nombre = "token") => {
  return sessionStorage.getItem(nombre);
};
