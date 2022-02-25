/* Utils: Num Tests. */
import { deg2rad } from './num';

describe('deg2rad', () => {
  it.each`
    degrees | expectedRadians
    ${0}    | ${0}
    ${45}   | ${0.785398}
    ${90}   | ${1.5708}
    ${180}  | ${3.1415926535897931}
  `('converts from degrees to radians', ({ degrees, expectedRadians }) => {
    expect.assertions(1);

    // GIVEN Degrees.
    // WHEN Converted to radians.
    const actualRadians = deg2rad(degrees);

    // THEN Expected radians is returned.
    expect(actualRadians).toBeCloseTo(expectedRadians);
  });
});
