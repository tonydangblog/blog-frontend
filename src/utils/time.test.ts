/* Utils: Time Tests. */
import { addDaysToDate, secondsToString, sleep } from './time';

describe('addDaysToDate', () => {
  it.each`
    dateParam                       | days | expected
    ${'September 9, 2021 11:13:00'} | ${9} | ${new Date('September 18, 2021 11:13:00')}
    ${'December 31, 2021 11:13:00'} | ${2} | ${new Date('January 2, 2022 11:13:00')}
  `('adds specified number of days to a date', ({ dateParam, days, expected }) => {
    expect.assertions(1);

    // GIVEN dateParam and days to add.
    // WHEN addDaysToDate is called.
    const dateObj = addDaysToDate(dateParam, days);

    // THEN Return date object is as expected.
    expect(dateObj).toStrictEqual(expected);
  });
});

describe('secondsToString', () => {
  it.each`
    seconds           | expected
    ${0}              | ${'0:00'}
    ${8}              | ${'0:08'}
    ${8.5}            | ${'0:09'}
    ${15}             | ${'0:15'}
    ${9 * 60}         | ${'9:00'}
    ${50 * 60}        | ${'50:00'}
    ${3600}           | ${'1:00:00'}
    ${3600 + 9 * 60}  | ${'1:09:00'}
    ${3600 + 10 * 60} | ${'1:10:00'}
    ${72 * 3600}      | ${'72:00:00'}
    ${128 * 3600}     | ${'128:00:00'}
  `('converts seconds to string format', ({ seconds, expected }) => {
    expect.assertions(1);

    // GIVEN Seconds to convert.
    // WHEN secondsToString is called.
    const formattedSeconds = secondsToString(seconds);

    // THEN Seconds is formatted to expected string.
    expect(formattedSeconds).toBe(expected);
  });
});

describe('sleep', () => {
  it.each`
    milliseconds
    ${1000}
    ${2000}
  `('suspends execution of script for given milliseconds', async ({ milliseconds }) => {
    expect.assertions(1);

    // GIVEN Initial start time in milliseconds and milliseconds to sleep for.
    const initialTime = new Date().getTime();

    // WHEN sleep is called with given milliseconds.
    await sleep(milliseconds);

    // THEN Script execution is suspended for given milliseconds.
    const expectedEndTime = (initialTime + milliseconds) / 1000;
    const actualEndTime = new Date().getTime() / 1000;
    expect(actualEndTime).toBeCloseTo(expectedEndTime, 1);
  });
});
