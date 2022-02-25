/* Settings: Email Frequency Form Test Setup. */
function setupDOM() {
  document.body.innerHTML = `
    <form id="settings__email-frequency-form" autocomplete="off">
      <h2>Email frequency.</h2>
      <p>Change how frequently you would like to see emails from me.</p>

      <input type="hidden" name="csrf_token" value="{{ csrf_token() }}" />

      <div class="radio">
      <input type="radio" id="settings__sometimes" name="mailing_list" value="1" />
      <label for="settings__sometimes">
        <strong>Sometimes:</strong> Be notified whenever I post something new.
      </label>
      </div>

      <div class="radio">
      <input type="radio" id="settings__rarely" name="mailing_list" value="2" />
      <label for="settings__rarely">
        <strong>Rarely:</strong> Only receive an email when I have a big update.
      </label>
      </div>

      <div class="radio">
      <input type="radio" id="settings__never" name="mailing_list" value="0" />
      <label for="settings__never">
        <strong>Never:</strong> Unsubscribe from my mailing list.
      </label>
      </div>
      <br />

      <button class="{{ button_mixes }}">
        <span class="button__text">UPDATE</span>
        <img
          class="button__spinner"
          src="{{ static_file('gif/spinner.gif') }}"
          alt="loading spinner"
        />
      </button>
    </form>
  `;
  return {
    form: document.querySelector('#settings__email-frequency-form'),
    button: document.querySelector('#settings__email-frequency-form button')!,
    spinner: document.querySelector(
      '#settings__email-frequency-form .button__spinner'
    ) as HTMLElement,
  };
}

export { setupDOM };
