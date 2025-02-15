import Cookies from "js-cookie";
/**
 * Sets the access token and refresh token in cookies with configurable expiration.
 * @param {string} accessToken - The access token.
 * @param {string} refreshToken - The refresh token.
 */
export const setToken = (accessToken, refreshToken) => {
  Cookies.set("authToken", accessToken, { expires: 1 }); 
  Cookies.set("refreshToken", refreshToken, { expires: 365 * 10 }); // Set refresh token to expire in 10 years

};
/**
 * Retrieves the access token from cookies.
 * @returns {string | undefined} - The access token, or undefined if not set.
 */
export const getToken = () => {
  return Cookies.get("authToken");
};
/**
 * Retrieves the refresh token from cookies.
 * @returns {string | undefined} - The refresh token, or undefined if not set.
 */
export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};
/**
 * Removes the access token and refresh token from cookies.
 */
export const removeToken = () => {
  Cookies.remove("authToken");
  Cookies.remove("refreshToken");
};

/**
 * Sets the application permissions in cookies.
 * @param {object} permissions - The application permissions.
 */
export const setPermissions = (permissions) => {
  if (permissions) {
    Cookies.set('applicationPermissions', JSON.stringify(permissions), { expires: 1 });
  }
};

/**
 * Retrieves the application permissions from cookies.
 * @returns {object|null} - The application permissions, or null if not set.
 */
export const getPermissions = () => {
  const permissions = Cookies.get('applicationPermissions');
  return permissions ? JSON.parse(permissions) : null;
};
