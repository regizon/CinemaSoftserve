import { jwtDecode } from 'jwt-decode';
export function isTokenValid(token) {

  try {
    const decoded = jwtDecode(token);
    console.log(decoded.role)
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
    const currentTime = Math.floor(Date.now() / 1000);

    const isValid = decoded.exp && decoded.exp > currentTime;
    const role = decoded.role;

    return {
      isValid,
      role,
    };
  } catch (error) {
    console.error('Invalid token:', error);
    return {
      isValid: false,
      role: null,
    };
  }
}