/* Base (Sync): Index. */
import {
  checkAndSetTheme,
  darkModeToggleListener,
  watchForDarkModeToggle,
} from './dark-mode';

checkAndSetTheme();
watchForDarkModeToggle();
document.addEventListener('DOMContentLoaded', darkModeToggleListener);
