export const setCookie = (valor, nombre = "token", horas = 168) => {
  /* const fecha = new Date();
  fecha.setTime(fecha.getTime() + horas * 60 * 60 * 1000);
  const fechaUTC = fecha.toString;
  document.cookie = `${nombre}=${valor}; expires=${fechaUTC}; path=/`; */
  localStorage.setItem(nombre, valor);
};

export const getCookie = (nombre = "token") => {
  /*  try {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieNombre, cookieValor] = cookie.split("=");
      if (cookieNombre === nombre) {
        return decodeURIComponent(cookieValor);
      }
    }
    return null; // Retorna null si la cookie no se encuentra
  } catch (error) {
    return null;
  } */
  return localStorage.getItem(nombre);
};

export const updateCookie = (valor, nombre = "token", horas = 999) => {
  /* const fecha = new Date();
  fecha.setTime(fecha.getTime() + horas * 60 * 60 * 1000);
  const fechaUTC = fecha.toString;
  document.cookie = `${nombre}=${valor}; expires=${fechaUTC}; path=/`; */
  localStorage.setItem(nombre, valor);
};

export const deleteCookie = (nombre = "token") => {
  /* const fechaExpiracionPasada = new Date(0);
  const fechaExpiracionUTC = fechaExpiracionPasada.toUTCString();
  document.cookie = `${nombre}=; expires=${fechaExpiracionUTC}; path=/`; */
  localStorage.clear();
};

export const setSession = (valor, nombre = "token") => {
  sessionStorage.setItem(nombre, valor);
};

export const getSession = (nombre = "token") => {
  const sessionData = sessionStorage.getItem(nombre);
  if (sessionData === "null") {
    return null;
  }
  return sessionData;
};

export const clearSession = () => {
  sessionStorage.clear();
};
