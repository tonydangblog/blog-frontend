/* Settings: Info Update Form Test Setup. */
function setupDOM() {
  document.body.innerHTML = `
    <h1>Hi {{ current_user.preferred_name }} &#x1F44B;</h1>
    <form id="info-update-form" autocomplete="off">
      <h2>Update your info.</h2>
      <p><strong>Email:</strong> {{ current_user.email }}</p>

      <input type="hidden" name="csrf_token" value="{{ csrf_token() }}" />

      <label for="info-update-form__name">What is your name? *</label><br />
      <input
        id="info-update-form__name"
        type="text"
        name="name"
        maxlength="50"
        placeholder="Name"
        value="{{ current_user.name }}"
        required
      /><br /><br />

      <label for="info-update-form__preferred-name"
        >How would you like to be addressed?</label
      ><br />
      <input
        id="info-update-form__preferred-name"
        type="text"
        name="preferred_name"
        maxlength="50"
        placeholder="Preferred name"
        value="{{ current_user.preferred_name }}"
      /><br /><br />

      <button class="{{ button_mixes }}">
        <span class="button__text">SAVE</span>
        <img
          class="button__spinner"
          src="{{ static_file('gif/spinner.gif') }}"
          alt="loading spinner"
        />
      </button>
    </form>
  `;
  return {
    h1: document.querySelector('h1')!,
    form: document.querySelector('#info-update-form'),
    name: document.querySelector('#info-update-form__name') as HTMLInputElement,
    preferredName: document.querySelector(
      '#info-update-form__preferred-name'
    ) as HTMLInputElement,
    button: document.querySelector('#info-update-form button')!,
    spinner: document.querySelector(
      '#info-update-form .button__spinner'
    ) as HTMLElement,
  };
}

export { setupDOM };
