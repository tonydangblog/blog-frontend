/* App Configuration Settings. */
const config = {
  loginURL: `/auth/login?next_url=${window.location.pathname}`,
  myCoords: { latitude: 37.366885164357875, longitude: -121.94797434479396 }, // PGSC
};

export { config };
