/* Posts: Search. */
import { addClassesOn } from '../utils/dom';

interface Post {
  title: string;
  path: string;
}

function displayPosts(posts: Post[]): void {
  // Display blog posts if non-empty array, else display no posts message.
  const whoops = document.querySelector('.whoops');
  const blogPosts = document.getElementById('blog-posts');
  if (whoops instanceof HTMLElement && blogPosts) {
    blogPosts.innerHTML = '';
    if (posts.length) {
      whoops.style.display = 'none';
      posts.forEach((post: Post): void => {
        const p = document.createElement('p');
        p.innerHTML = `
          <a class="a--no-decoration" href="${post.path}">
            ${post.title}
          </a>
        `;
        blogPosts.appendChild(p);
      });
    } else {
      whoops.style.display = 'block';
    }
  }
}

function clearSearchListener(posts: Post[]): void {
  // Handle clear button presses.
  const input = document.getElementById('posts__search-form__input');
  const button = document.getElementById('posts__search-form__clear');
  if (input instanceof HTMLInputElement && button) {
    button.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      input.value = '';
      displayPosts(posts);
      addClassesOn('#posts__search-form__clear', ['button--disabled']);
    });
  }
}

function disableClearButtonListener(): void {
  // Disable clear button when input is empty.
  const input = document.getElementById('posts__search-form__input');
  const button = document.getElementById('posts__search-form__clear');
  /* istanbul ignore else */
  if (input instanceof HTMLInputElement && button) {
    input.addEventListener('input', (): void => {
      if (!input.value) button.classList.add('button--disabled');
      else button.classList.remove('button--disabled');
    });
  }
}

function filterPosts(search: string, posts: Post[]): Post[] {
  // Return blog posts filtered by search string.
  return posts.filter((post: Post): RegExpMatchArray | null =>
    post.title.match(new RegExp(search, 'i'))
  );
}

function getPosts(): Post[] {
  // Get blog posts from DOM.
  const blogPosts = document.getElementById('blog-posts');
  // eslint-disable-next-line dot-notation
  if (blogPosts && blogPosts.dataset['posts']) {
    return JSON.parse(blogPosts.dataset['posts']); // eslint-disable-line dot-notation
  }
  return [];
}

function searchInputListener(posts: Post[]): void {
  // Listen for search input and dynamically perform search.
  const input = document.getElementById('posts__search-form__input');
  /* istanbul ignore else */
  if (input instanceof HTMLInputElement) {
    input.addEventListener('input', (): void =>
      displayPosts(filterPosts(input.value, posts))
    );
  }
}

export {
  clearSearchListener,
  disableClearButtonListener,
  displayPosts,
  filterPosts,
  getPosts,
  searchInputListener,
};
