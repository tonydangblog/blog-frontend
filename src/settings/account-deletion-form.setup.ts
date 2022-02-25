/* Settings: Account Deletion Form Test Setup. */
function setupDOM() {
  document.body.innerHTML = `
    <form id="delete-form" autocomplete="off">
      <h2>Delete account.</h2>
      <p>If you wish to delete this account, enter your email here.</p>

      <input type="hidden" name="csrf_token" value="{{ csrf_token() }}" />
      <input
        type="email"
        name="email"
        maxlength="256"
        placeholder="Enter your email"
        required
      /><br /><br />

      <button class="{{ button_mixes }}">
        <span class="button__text">DELETE</span>
        <img
          class="button__spinner"
          src="{{ static_file('gif/spinner.gif') }}"
          alt="loading spinner"
        />
      </button>
    </form>
  `;
  return {
    form: document.querySelector('#delete-form'),
    button: document.querySelector('#delete-form button')!,
    spinner: document.querySelector('#delete-form .button__spinner') as HTMLElement,
  };
}

export { setupDOM };
