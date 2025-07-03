import { jwtDecode } from 'jwt-decode';
export function isTokenValid(token) {

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    console.log(decoded.exp > currentTime)
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
}