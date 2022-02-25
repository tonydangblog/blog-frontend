/* Utils: Form Submission - Post.

Requires loginURL set in app config.
*/
import { config } from '../config';
import { enableForm } from './form-submission-disable';

async function postForm(
  url: string,
  form: HTMLFormElement,
  successHandler: Function,
  errorHandler: Function,
  errorMessage?: string
): Promise<void> {
  // Wrapper for sending form POST request to server.
  try {
    const res = await fetch(url, { method: 'POST', body: new FormData(form) });
    if (res.status === 200) {
      const data = await res.json();
      successHandler(data);
      enableForm(form);
      return;
    }
    if (res.status === 401) {
      window.location.replace(config.loginURL);
      return;
    }
    if ([400, 404, 500].includes(res.status)) {
      window.location.reload();
      return;
    }
    throw new Error(errorMessage || '500 - Whoops, something went wrong...');
  } catch (error: unknown) {
    errorHandler(error);
  }
}

export { postForm };
