/* Now: Distance Apart.

Requires myCoords set in app config.
*/
import { flash } from '../common/message-flashing';
import { config } from '../config';
import { deg2rad } from '../utils/num';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const distanceApartMessages = [
  'Wait a sec...that means we are practically right next to each other right now!',
  "Whoa, we're super close...perhaps we should meet up for a coffee sometime?",
  `We aren't exactly neighbors, but perhaps we're close enough to run into each
   other one day?`,
  "Seems like we're pretty far apart, but I'm sure that won't always be the case :)",
] as const;

const errorTypes = [
  `Sorry, an unknown error has occurred so it can't be determined how far apart we are
   right now :(`,
  `Hmm, it looks like permission to use your location to see how far apart we are was
   denied :(`,
  `Sorry, your location is unavailable at the moment to calculate how far apart we are
   :(`,
  'Calculating how far apart we are. Hang tight...',
] as const;

// getCurrentPosition() options
const positionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 100,
};

function computeDistance(startCoords: Coordinates, destCoords: Coordinates): number {
  // Returns distance (in km) between two coordinates per Spherical Law of Cosines.
  const startLatRads = deg2rad(startCoords.latitude);
  const startLongRads = deg2rad(startCoords.longitude);
  const destLatRads = deg2rad(destCoords.latitude);
  const destLongRads = deg2rad(destCoords.longitude);
  const radius = 6371; // radius of Earth in km
  return (
    Math.acos(
      Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) *
          Math.cos(destLatRads) *
          Math.cos(startLongRads - destLongRads)
    ) * radius
  );
}

function displayDistance(position: { coords: Coordinates }): void {
  // Success callback function to display distance apart.
  const km = computeDistance(position.coords, config.myCoords);
  let msg =
    'By the magic of the internet, it looks like we are <strong> ' +
    `${Math.round(km)} km (aka ${Math.round(km / 1.609)} mi)</strong> apart! `;

  if (km < 1) msg += distanceApartMessages[0];
  else if (km < 20) msg += distanceApartMessages[1];
  else if (km < 160) msg += distanceApartMessages[2];
  else msg += distanceApartMessages[3];

  flash(msg);
}

function displayError(error: { code: number }): void {
  // Error callback function to display error if applicable.
  if (error.code === 0 || error.code === 1 || error.code === 2) {
    flash(errorTypes[error.code]);
  } else if (error.code === 3 && positionOptions.timeout < 2000) {
    positionOptions.timeout += 100;
    navigator.geolocation.getCurrentPosition(
      displayDistance,
      displayError,
      positionOptions
    );
    const msg = errorTypes[error.code] + positionOptions.timeout / 100;
    const flashMessageText = document.querySelector('.flash-messages__text');
    if (flashMessageText) flashMessageText.innerHTML = msg;
    else flash(msg);
  } else {
    flash(
      `Sorry, looks like this is taking longer than expected. Please feel free to try
       again later if you really want to know how far apart we are ^^'`
    );
  }
}

function distanceApartListener(): void {
  // Check Geolocation support and adds listener.
  const distanceApart = document.getElementById('distance-apart');
  const distanceApartButton = document.getElementById('distance-apart__button');
  if (navigator.geolocation && distanceApart && distanceApartButton) {
    distanceApart.style.display = 'block';
    distanceApartButton.addEventListener('click', (): void => {
      navigator.geolocation.getCurrentPosition(
        displayDistance,
        displayError,
        positionOptions
      );
    });
  }
}

export {
  computeDistance,
  displayDistance,
  displayError,
  distanceApartListener,
  distanceApartMessages,
  errorTypes,
  positionOptions,
};
