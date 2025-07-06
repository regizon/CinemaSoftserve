import { jwtDecode } from 'jwt-decode';
export function isTokenValid(token) {

  try {
    const decoded = jwtDecode(token);
    console.log(decoded)
    if (!decoded.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
}

export function getUserRole(token) {
  try {
    const decoded = jwtDecode(token);
    console.log(decoded)
    return decoded.role || decoded.roles?.[0] || decoded.user?.role || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}