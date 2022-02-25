/* Base: Index. */
import { dismissFlashMessageListener } from '../common/message-flashing';
import { formElementStyleListener } from '../utils/form-element-style';
import { updateCopyrightYear } from './copyright-year';
import { offlineListener } from './offline';
import { showSubscriptionFormListener } from './show-subscription-form';
import { resetSideMenuListener, sideMenuToggleListener } from './side-menu';
import { subscriptionFormListener } from './subscription-form';
import { vimBindingsListener } from './vim';

dismissFlashMessageListener();
formElementStyleListener('form-element--non-empty-value');
updateCopyrightYear();
offlineListener();
showSubscriptionFormListener();
resetSideMenuListener();
sideMenuToggleListener();
subscriptionFormListener();
vimBindingsListener();
