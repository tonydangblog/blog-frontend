/* Posts: Search Tests. */
import {
  clearSearchListener,
  disableClearButtonListener,
  displayPosts,
  filterPosts,
  getPosts,
  searchInputListener,
} from './search';

function setupDOM() {
  const postsJSON = JSON.stringify([{ title: '{dev}athlete', path: '/devathlete' }]);
  document.body.innerHTML = `
    <h1>Posts</h1>
    <form class="posts__search-form" autocomplete="off">
      <input id="posts__search-form__input" type="search" placeholder="Search" autofocus />
      <button id="posts__search-form__clear">CLEAR</button>
    </form>
    <div class="whoops whoops--hidden" style="display: none;">
      <p class="whoops__emoticon">(◑_◑)</p>
      <p class="whoops__message">Can't find any posts...</p>
    </div>
    <div id="blog-posts" data-posts=${postsJSON}></div>
  `;
  return {
    postsArray: JSON.parse(postsJSON),
    searchInput: document.getElementById(
      'posts__search-form__input'
    ) as HTMLInputElement,
    clearButton: document.getElementById('posts__search-form__clear')!,
    whoops: document.querySelector('.whoops') as HTMLElement,
    blogPosts: document.getElementById('blog-posts')!,
  };
}

describe('displayPosts', () => {
  it.each`
    posts                                               | expectedContent                                      | expectedWhoops
    ${[{ title: '{dev}athlete', path: '/devathlete' }]} | ${'<a class="a--no-decoration" href="/devathlete">'} | ${'none'}
    ${[]}                                               | ${'<p class="whoops__emoticon">(◑_◑)</p>'}           | ${'block'}
  `(
    'displays posts if given array of posts is not empty',
    ({ posts, expectedContent, expectedWhoops }) => {
      expect.assertions(2);

      // GIVEN DOM.
      const dom = setupDOM();

      // WHEN Posts are displayed.
      displayPosts(posts);

      // THEN Posts/whoops message is present in DOM accordingly.
      expect(document.body.innerHTML).toContain(expectedContent);
      expect(dom.whoops.style.display).toBe(expectedWhoops);
    }
  );
  it.each`
    posts                                               | expectedContent                                      | expectedWhoops
    ${[{ title: '{dev}athlete', path: '/devathlete' }]} | ${'<a class="a--no-decoration" href="/devathlete">'} | ${'none'}
    ${[]}                                               | ${'random_string_as_placeholder'}                    | ${'none'}
  `(
    'takes no action if blog posts div is not present in DOM',
    ({ posts, expectedContent, expectedWhoops }) => {
      expect.assertions(2);

      // GIVEN DOM without blog posts div.
      const dom = setupDOM();
      dom.blogPosts.remove();

      // WHEN Posts are displayed.
      displayPosts(posts);

      // THEN Posts are not present in DOM and whoops is not displayed.
      expect(document.body.innerHTML).not.toContain(expectedContent);
      expect(dom.whoops.style.display).toBe(expectedWhoops);
    }
  );
});

describe('clearSearchListener', () => {
  it('handles clear button clicks', () => {
    expect.assertions(7);

    // GIVEN DOM, clearSearchListener, and existing search input value.
    const dom = setupDOM();
    clearSearchListener(getPosts());
    dom.searchInput.value = 'asdfghjkl';
    expect(dom.searchInput.value).toBe('asdfghjkl');
    expect(dom.blogPosts.innerHTML).toBe('');
    expect(dom.clearButton.className).toBe('');

    // WHEN Click event is dispatched.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    dom.clearButton.dispatchEvent(event);

    // THEN Input is cleared, initial posts are displayed, and clear button is disabled.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(dom.searchInput.value).toBe('');
    expect(dom.blogPosts.innerHTML).toContain('{dev}athlete');
    expect(dom.clearButton.className).toBe('button--disabled');
  });
  it('takes no action if input missing from DOM', () => {
    expect.assertions(1);

    // GIVEN DOM with missing search input and clearSearchListener.
    const dom = setupDOM();
    dom.searchInput.remove();
    clearSearchListener(getPosts());

    // WHEN Click event is dispatched.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    dom.clearButton.dispatchEvent(event);

    // THEN No action is taken.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
  });
});

describe('disableClearButtonListener', () => {
  it.each`
    value       | expected
    ${''}       | ${'button--disabled'}
    ${'truthy'} | ${''}
  `('disables clear button on falsy input', ({ value, expected }) => {
    expect.assertions(1);

    // GIVEN DOM and disableClearButtonListener.
    const dom = setupDOM();
    disableClearButtonListener();

    // WHEN Input event is dispatched.
    dom.searchInput.value = value;
    dom.searchInput.dispatchEvent(new Event('input'));

    // THEN Clear button has expected class.
    expect(dom.clearButton.className).toBe(expected);
  });
});

describe('filterPosts', () => {
  const posts = [
    { title: '{dev}athlete', path: '/devathlete' },
    { title: 'title', path: '/path' },
  ];
  it.each`
    search         | expected
    ${'dev'}       | ${[{ title: '{dev}athlete', path: '/devathlete' }]}
    ${''}          | ${posts}
    ${'asdfghjkl'} | ${[]}
  `('filters post array by search term', ({ search, expected }) => {
    expect.assertions(1);

    // GIVEN Search term and initial posts.
    // WHEN Initial posts are filtered.
    // THEN Array of filtered posts is returned.
    expect(filterPosts(search, posts)).toStrictEqual(expected);
  });
});

describe('getPosts', () => {
  it.each`
    setup              | expected
    ${setupDOM}        | ${[{ title: '{dev}athlete', path: '/devathlete' }]}
    ${() => undefined} | ${[]}
  `('returns array of blog posts if data present in DOM', ({ setup, expected }) => {
    expect.assertions(1);

    // GIVEN DOM with/without blog post data.
    setup();

    // WHEN getPosts is called.
    // THEN getPosts returns array of blog post if data present in DOM else return [].
    expect(getPosts()).toStrictEqual(expected);
  });
});

describe('searchInputListener', () => {
  it('triggers search on user input', () => {
    expect.assertions(1);

    // GIVEN DOM and searchInputListener.
    const dom = setupDOM();
    searchInputListener(getPosts());

    // WHEN Input event is dispatched.
    dom.searchInput.value = 'asdfghjkl';
    dom.searchInput.dispatchEvent(new Event('input'));

    // THEN Search is triggered.
    expect(document.body.innerHTML).toContain('whoops');
  });
});
