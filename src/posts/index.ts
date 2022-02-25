/* Posts: Index. */
import { addClassesOn, disableKeysOn } from '../utils/dom';
import {
  clearSearchListener,
  disableClearButtonListener,
  displayPosts,
  getPosts,
  searchInputListener,
} from './search';

addClassesOn('#posts__search-form__clear', ['button--disabled']);
disableKeysOn('#posts__search-form__input', ['Enter']);

const posts = getPosts();
clearSearchListener(posts);
disableClearButtonListener();
displayPosts(posts);
searchInputListener(posts);
