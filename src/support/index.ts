/* Support: Index. */
import { reloadIfCachedListener } from '../utils/reload-if-cached';
import { loadingSpinnerListener } from './loading-spinner';
import { qtyAddListener, qtyInputListener, qtyRemoveListener } from './qty';

/* eslint-disable jest/require-hook */
reloadIfCachedListener();
loadingSpinnerListener();
qtyAddListener();
qtyInputListener();
qtyRemoveListener();
