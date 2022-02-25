/* Base: Subscription Form Test Setup. */
function setupDOM() {
  document.body.innerHTML = `
    <form id="subscription-form" class="subscription-form" autocomplete="on">
      <p class="subscription-form__title">GET BLOG UPDATES &amp; ANNOUNCEMENTS</p>

      <div class="subscription-form__inputs">
        <input type="hidden" name="csrf_token" value="{{ csrf_token() }}" />
        <input
          class="subscription-form__name"
          type="text"
          placeholder="NAME"
          name="name"
          maxlength="50"
          required
        />
        <input
          class="subscription-form__email"
          type="email"
          placeholder="EMAIL"
          name="email"
          maxlength="256"
          required
        />

        <button class="subscription-form__button">
          <span class="button__text">SUBMIT</span>
          <img
            class="button__spinner"
            src="{{ static_file('gif/spinner.gif') }}"
            alt="loading spinner"
          />
        </button>
      </div>

      <div class="subscription-form__arrow">--&gt;</div>
    </form>
  `;
  return {
    form: document.querySelector('.subscription-form'),
    name: document.querySelector('.subscription-form__name') as HTMLInputElement,
    email: document.querySelector('.subscription-form__email') as HTMLInputElement,
    button: document.querySelector('.subscription-form__button')!,
    spinner: document.querySelector(
      '.subscription-form .button__spinner'
    ) as HTMLElement,
  };
}

export { setupDOM };
