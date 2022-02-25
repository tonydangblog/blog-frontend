/* Now: Distance Apart Tests. */
import { config } from '../config';
import {
  computeDistance,
  displayDistance,
  displayError,
  distanceApartListener,
  distanceApartMessages,
  errorTypes,
  positionOptions,
} from './distance-apart';

describe('computeDistance', () => {
  const case1 = {
    startCoords: { latitude: 37.4315184, longitude: -121.9047976 }, // Milpitas
    destCoords: { latitude: 32.7532736, longitude: -117.1198062 }, // San Diego
    km: 678,
    mi: 421,
  };
  const case2 = {
    startCoords: { latitude: 37.4315184, longitude: -121.9047976 }, // Milpitas
    destCoords: { latitude: 39.8422312, longitude: -104.8268234 }, // Denver
    km: 1505,
    mi: 935,
  };
  it.each`
    startCoords          | destCoords          | km          | mi
    ${case1.startCoords} | ${case1.destCoords} | ${case1.km} | ${case1.mi}
    ${case2.startCoords} | ${case2.destCoords} | ${case2.km} | ${case2.mi}
  `(
    'computes distance between two sets of coordinates',
    ({ startCoords, destCoords, km, mi }) => {
      expect.assertions(2);

      // GIVEN Start and destination coordinates.
      // WHEN Distance is computed.
      const actualKm = Math.round(computeDistance(startCoords, destCoords));
      const actualMi = Math.round(computeDistance(startCoords, destCoords) / 1.609);

      // THEN Distance to be expected.
      expect(actualKm).toBe(km);
      expect(actualMi).toBe(mi);
    }
  );
});

describe('displayDistance', () => {
  const cases = [
    {
      // Fremont
      position: { coords: { latitude: 37.5843197, longitude: -122.057398 } },
      distance: '0 km (aka 0 mi)',
      message: distanceApartMessages[0],
    },
    {
      // Lake Elizabeth
      position: { coords: { latitude: 37.5494324, longitude: -121.961927 } },
      distance: '9 km (aka 6 mi)',
      message: distanceApartMessages[1],
    },
    {
      // Milpitas
      position: { coords: { latitude: 37.4356757, longitude: -121.898425 } },
      distance: '22 km (aka 13 mi)',
      message: distanceApartMessages[2],
    },
    {
      // San Diego
      position: { coords: { latitude: 32.7532736, longitude: -117.1198062 } },
      distance: '700 km (aka 435 mi)',
      message: distanceApartMessages[3],
    },
  ] as const;
  it.each`
    position             | distance             | message
    ${cases[0].position} | ${cases[0].distance} | ${cases[0].message}
    ${cases[1].position} | ${cases[1].distance} | ${cases[1].message}
    ${cases[2].position} | ${cases[2].distance} | ${cases[2].message}
    ${cases[3].position} | ${cases[3].distance} | ${cases[3].message}
  `('displays distance apart message', ({ position, distance, message }) => {
    expect.assertions(2);

    // GIVEN myCoords set to Fremont.
    const originalCoords = config.myCoords;
    config.myCoords = { latitude: 37.5843197, longitude: -122.057398 };

    // WHEN displayDistance is called.
    displayDistance(position);

    // THEN Expected message is flashed in DOM.
    const msg =
      'By the magic of the internet, it looks like we are <strong> ' +
      `${distance}</strong> apart!`;
    expect(document.body.innerHTML).toContain(msg);
    expect(document.body.innerHTML).toContain(message);

    // TEARDOWN.
    config.myCoords = originalCoords;
  });
});

describe('displayError', () => {
  it.each`
    errorCode | message
    ${0}      | ${errorTypes[0]}
    ${1}      | ${errorTypes[1]}
    ${2}      | ${errorTypes[2]}
  `('flashes error message', ({ errorCode, message }) => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN Errors 0-2 are passed to displayError.
    displayError({ code: errorCode });

    // THEN Corresponding error message is flashed.
    expect(document.body.innerHTML).toContain(message);
  });
  it('increments timeout', () => {
    expect.assertions(22);

    // GIVEN N/A.
    // WHEN Error 3 is passed to displayError and max timeout has not been reached.
    displayError({ code: 3 });

    // THEN Timeout is incremented, getCurrentPosition is called, and message is flashed.
    expect(positionOptions.timeout).toBe(200);
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
      displayDistance,
      displayError,
      positionOptions
    );
    expect(document.body.innerHTML).toContain(
      errorTypes[3] + positionOptions.timeout / 100
    );

    // WHEN Timeout is incremented from previous displayError call.
    // THEN Flash message is incremented.
    while (positionOptions.timeout < 2000) {
      displayError({ code: 3 });
      expect(document.body.innerHTML).toContain(
        errorTypes[3] + positionOptions.timeout / 100
      );
    }

    // WHEN timeout reaches 2000ms and displayError is called.
    displayError({ code: 3 });

    // THEN Timeout message is flashed.
    const msg = `Sorry, looks like this is taking longer than expected. Please feel free to try
       again later if you really want to know how far apart we are ^^'`;
    expect(document.body.innerHTML).toContain(msg);
  });
  it('replaces existing flash message text if present in DOM', () => {
    expect.assertions(1);

    // GIVEN Flash message already in DOM.
    document.body.innerHTML = '<p class="flash-messages__text">{{ message }}</p>';
    const text = document.querySelector('.flash-messages__text')!;
    positionOptions.timeout = 100;

    // WHEN Error 3 is passed to displayError and max timeout has not been reached.
    displayError({ code: 3 });

    // THEN Existing flash message is updated rather than flashing new message.
    expect(text.innerHTML).toContain(errorTypes[3] + positionOptions.timeout / 100);
  });
});

describe('distanceApartListener', () => {
  function setupDom() {
    document.body.innerHTML = `
      <div id="distance-apart" style="display: none;">
        <button id="distance-apart__button" class="button--center">CLICK HERE...</button>
      </div>
    `;
    return {
      div: document.getElementById('distance-apart')!,
      button: document.getElementById('distance-apart__button')!,
    };
  }
  it('handles distance apart request', () => {
    expect.assertions(2);

    // GIVEN DOM with distance apart div and distanceApartListener.
    const dom = setupDom();
    distanceApartListener();

    // WHEN geolocation is implemented in the browser and button is clicked.
    dom.button.dispatchEvent(new Event('click'));

    // THEN div is shown to user and getCurrentPosition is called on click.
    expect(dom.div.style.display).toBe('block');
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
      displayDistance,
      displayError,
      positionOptions
    );
  });
  it('does not show div if geolocation not implemented', () => {
    expect.assertions(1);

    // GIVEN DOM with distance apart div and geolocation undefined.
    Object.defineProperty(global.navigator, 'geolocation', { value: undefined });
    const dom = setupDom();

    // WHEN distanceApartListener is called.
    distanceApartListener();

    // THEN div is NOT shown to user.
    expect(dom.div.style.display).toBe('none');
  });
});
