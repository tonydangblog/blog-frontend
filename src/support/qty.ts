/* Support: Qty. */
function updateOneTimeDonationQty(qty: number): void {
  /* Update one time donation quantity in checkout button. */
  const oneTimeQty = document.getElementById('support__one-time__qty');
  /* istanbul ignore else */
  if (oneTimeQty instanceof HTMLInputElement) oneTimeQty.value = `${qty}`;
}

function updateOneTimeDonationText(qty: number): void {
  /* Update one time donation text in checkout button. */
  const submitButtonText = document.querySelector(
    `.support__one-time__submit-button .button__text`
  );
  /* istanbul ignore else */
  if (submitButtonText) submitButtonText.innerHTML = `SUPPORT $${5 * qty}`;
}

function qtyAddListener(): void {
  /* Listen for qty addition. */
  const button = document.querySelector('.support__one-time__qty-add');
  const qtyInput = document.querySelector('.support__one-time__qty-input');
  /* istanbul ignore else */
  if (button && qtyInput instanceof HTMLInputElement) {
    button.addEventListener('click', (): void => {
      let qty = parseInt(qtyInput.value, 10);
      const max = parseInt(qtyInput.max, 10);
      if (qty < max) qty += 1;
      qtyInput.value = `${qty}`;
      updateOneTimeDonationQty(qty);
      updateOneTimeDonationText(qty);
    });
  }
}

function qtyInputListener(): void {
  /* Listen for qty changes. */
  const qtyInput = document.querySelector('.support__one-time__qty-input');
  /* istanbul ignore else */
  if (qtyInput instanceof HTMLInputElement) {
    qtyInput.addEventListener('change', (): void => {
      let qty = parseInt(qtyInput.value, 10);
      const max = parseInt(qtyInput.max, 10);
      if (Number.isNaN(qty) || qty < 1) {
        qtyInput.value = `${1}`;
        qty = 1;
      } else if (qty > max) {
        qtyInput.value = `${max}`;
        qty = max;
      }
      updateOneTimeDonationQty(qty);
      updateOneTimeDonationText(qty);
    });
  }
}

function qtyRemoveListener(): void {
  /* Listen for qty removal. */
  const button = document.querySelector('.support__one-time__qty-remove');
  const qtyInput = document.querySelector('.support__one-time__qty-input');
  /* istanbul ignore else */
  if (button && qtyInput instanceof HTMLInputElement) {
    button.addEventListener('click', (): void => {
      let qty = parseInt(qtyInput.value, 10);
      if (qty > 1) qty -= 1;
      qtyInput.value = `${qty}`;
      updateOneTimeDonationQty(qty);
      updateOneTimeDonationText(qty);
    });
  }
}

export {
  qtyAddListener,
  qtyInputListener,
  qtyRemoveListener,
  updateOneTimeDonationQty,
  updateOneTimeDonationText,
};
