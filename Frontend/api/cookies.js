export function hasCookie(name) {
  return document.cookie.split(";").some((c) => {
    return c.trim().startsWith(name + "=");
  });
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
}

export function setCookie(name, value, expiredInSeconds) {
  const day = new Date(
    new Date().getTime() + expiredInSeconds * 1000
  ).toUTCString();
  document.cookie = `${name}=${value};expires=${day};path=/`;
}

export function deleteCookie(name, path, domain) {
  if (hasCookie(name)) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    // document.cookie = name + "=" +
    //   ((path) ? ";path=" + path : "") +
    //   ((domain) ? ";domain=" + domain : "") +
    //   ";expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}
