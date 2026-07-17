export const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  // Check if accessing via local network IP (e.g. 192.168.x.x or 10.x.x.x)
  const isIp = /^[0-9.]+$/.test(hostname);
  if (isIp) {
    return `http://${hostname}:5000`;
  }
  // On Netlify production, use relative paths so requests route via Netlify redirects
  return "";
};
