/* Utils: Form Submission Post Tests. */
import fetchMock from 'jest-fetch-mock';

import { enableForm } from './form-submission-disable';
import { postForm } from './form-submission-post';

jest.mock('./form-submission-disable');

describe('postForm', () => {
  it('handles 200 response', async () => {
    expect.assertions(2);

    // GIVEN N/A.
    // WHEN postForm call receives successful 200 response.
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
    const form = document.createElement('form');
    const successHandler = jest.fn();
    await postForm('/url', form, successHandler, jest.fn);

    // THEN successHandler is called with response data.
    expect(successHandler).toHaveBeenCalledWith({});
    expect(enableForm).toHaveBeenCalledWith(form);
  });
  it.each`
    status | method
    ${400} | ${'reload'}
    ${401} | ${'replace'}
    ${404} | ${'reload'}
    ${500} | ${'reload'}
  `('handles known 400, 401, 404, and 500 errors', async ({ status, method }) => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN postForm call receives known error as response.
    fetchMock.mockResponseOnce('', { status });
    await postForm('/url', document.createElement('form'), jest.fn, jest.fn);

    // THEN Error is handled by replace/reload to allow for Flask flash message.
    const locationMethod =
      method === 'reload' ? window.location.reload : window.location.replace;
    expect(locationMethod).toHaveBeenCalledTimes(1);
  });
  it.each`
    mockError                                                | errorObject
    ${() => fetchMock.mockResponseOnce('', { status: 999 })} | ${() => new Error('500 - Whoops, something went wrong...')}
    ${fetchMock.mockRejectOnce}                              | ${() => undefined}
    ${fetchMock.mockAbortOnce} | ${() => {
  const error = new Error('The operation was aborted. ');
  error.name = 'AbortError';
  return error;
}}
  `('handles unknown errors', async ({ mockError, errorObject }) => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN postForm call receives unknown error.
    mockError();
    const errorHandler = jest.fn();
    await postForm('/url', document.createElement('form'), jest.fn, errorHandler);

    // THEN errorHandler is called with Error object.
    expect(errorHandler).toHaveBeenCalledWith(errorObject());
  });
  it('allows custom error message', async () => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN postForm call (with custom error message set) receives unknown error.
    fetchMock.mockResponseOnce('', { status: 999 });
    const errorHandler = jest.fn();
    await postForm('/url', document.createElement('form'), jest.fn, errorHandler, 'e');

    // THEN errorHandler is called with Error object with custom error message.
    const errorObject = new Error('e');
    expect(errorHandler).toHaveBeenCalledWith(errorObject);
  });
});
