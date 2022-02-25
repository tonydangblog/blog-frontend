/* Now: Last Updated Tests. */
import MockDate from 'mockdate';

import { sleep } from '../utils/time';
import {
  displayLastUpdated,
  displayTimeSince,
  getLastUpdatedDate,
  incrementTimeSince,
} from './last-updated';

function setupDOM() {
  document.body.innerHTML = `
    <time id="now-last-updated" data-last-updated="1600000000000"></time>
    <time id="now-time-since"></time>
  `;
  return {
    lastUpdated: document.querySelector('#now-last-updated') as HTMLElement,
    timeSince: document.querySelector('#now-time-since')!,
  };
}

describe('getLastUpdatedDate', () => {
  it.each`
    setup              | expected
    ${setupDOM}        | ${1600000000000}
    ${() => undefined} | ${0}
  `('get last updated date from DOM if present', ({ setup, expected }) => {
    expect.assertions(1);

    // GIVEN DOM.
    setup();

    // WHEN getLastUpdatedDate is called.
    // THEN Date to be expected.
    expect(getLastUpdatedDate()).toBe(expected);
  });
});

describe('displayLastUpdated', () => {
  it.each`
    lastUpdatedTime  | expected
    ${1600000000000} | ${'Last Updated: September 13th, 2020 at 5:26:40 am.'}
    ${0}             | ${''}
  `('display human readable last updated date', ({ lastUpdatedTime, expected }) => {
    expect.assertions(1);

    // GIVEN Last updated time in DOM.
    const dom = setupDOM();
    // eslint-disable-next-line dot-notation
    dom.lastUpdated.dataset['lastUpdated'] = lastUpdatedTime;

    // WHEN displayLastUpdated is called.
    displayLastUpdated();

    // THEN Expected date is in DOM if last updated date is present in DOM..
    expect(dom.lastUpdated.innerHTML).toBe(expected);
  });
});

describe('displayTimeSince', () => {
  it.each`
    milliseconds | expected
    ${0}         | ${'0 seconds'}
    ${62000}     | ${'1 minute and 2 seconds'}
    ${3662000}   | ${'1 hour, 1 minute and 2 seconds'}
  `('displays time since last update', ({ milliseconds, expected }) => {
    expect.assertions(1);

    // GIVEN Last updated time in DOM.
    MockDate.set(1600000000000 + milliseconds);
    const dom = setupDOM();

    // WHEN displayTimeSince is called.
    displayTimeSince();

    // THEN Expected time since update is in DOM.
    expect(dom.timeSince.innerHTML).toBe(`(Or exactly ${expected} ago)`);
  });
  it('takes no action if last updated date missing from DOM', () => {
    expect.assertions(1);

    // GIVEN DOM without last updated date.
    const dom = setupDOM();
    // eslint-disable-next-line dot-notation
    dom.lastUpdated.dataset['lastUpdated'] = undefined;

    // WHEN displayTimeSince is called.
    displayTimeSince();

    // THEN Time since update is not displayed in DOM.
    expect(dom.timeSince.innerHTML).toBe('');
  });
});

describe('incrementTimeSince', () => {
  it('increments time since update every second', async () => {
    expect.assertions(3);

    // GIVEN Last updated time in DOM.
    MockDate.set(1600000000000);
    const dom = setupDOM();

    // WHEN incrementTimeSince is called.
    displayTimeSince();
    incrementTimeSince();

    // THEN Expected time since to be updated every second.
    expect(dom.timeSince.innerHTML).toContain('0 seconds');

    MockDate.set(1600000001000);
    await sleep(1000);
    expect(dom.timeSince.innerHTML).toContain('1 second');

    MockDate.set(1600000002000);
    await sleep(1000);
    expect(dom.timeSince.innerHTML).toContain('2 seconds');
  });
});
