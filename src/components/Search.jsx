import {createSignal, onMount} from "solid-js";
import {dealLabel} from "../utils/dealLabel.ts"
import {formatDate} from "../utils/formatDate.ts";

const toSearchText = (value) => String(value || '').toLowerCase();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapeHtml = (value) => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// タイトル等の一致箇所を強調した HTML を返す(元の文字列はエスケープしてから強調する)
const highlight = (text, searchTerm) => {
  const escapedText = escapeHtml(text);
  if (!searchTerm) return escapedText;
  const reg = new RegExp(escapeRegExp(escapeHtml(searchTerm)), 'gi');
  return escapedText.replace(reg, (match) => `<mark>${match}</mark>`);
};

const countLabels = (posts, pick) => {
  const counts = {};
  posts.forEach(post => {
    dealLabel(pick(post)).filter(label => label && label !== 'uncategorized').forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
};

// Pagefind の索引は本番ビルド時(astro build && pagefind)にだけ生成される。
// 読み込めない環境(astro dev など)ではタイトル・概要の簡易検索にフォールバックする。
const PAGEFIND_URL = '/pagefind/pagefind.js';
let pagefindPromise;
const loadPagefind = () => {
  pagefindPromise ??= import(/* @vite-ignore */ PAGEFIND_URL).catch(() => null);
  return pagefindPromise;
};

export function Search(props) {
  const [inputVal, setInputVal] = createSignal('')
  const [resultPosts, setResultPosts] = createSignal([])
  let latestSearchId = 0;

  const categories = countLabels(props.posts, post => post.data.category);
  const tags = countLabels(props.posts, post => post.data.tags);
  const postsByUrl = new Map(props.posts.map(post => [`/${post.collection}/${post.id}/`, post]));

  const searchByTitleAndDescription = (searchTerm) => {
    const normalizedSearchTerm = toSearchText(searchTerm);
    return props.posts
      .filter(post =>
        toSearchText(post.data.title).includes(normalizedSearchTerm)
        || toSearchText(post.data.description).includes(normalizedSearchTerm)
      )
      .map(post => ({post, excerpt: highlight(post.data.description, searchTerm)}));
  };

  const searchFullText = async (pagefind, searchTerm) => {
    const search = await pagefind.search(searchTerm);
    const results = await Promise.all(search.results.slice(0, 30).map(result => result.data()));
    return results
      .map(result => ({post: postsByUrl.get(result.url.replace(/\/?$/, '/')), excerpt: result.excerpt}))
      .filter(result => result.post);
  };

  const runSearch = async (searchTerm) => {
    const searchId = ++latestSearchId;
    if (searchTerm.trim() === '') {
      setResultPosts([]);
      return;
    }
    const pagefind = await loadPagefind();
    const results = pagefind
      ? await searchFullText(pagefind, searchTerm)
      : searchByTitleAndDescription(searchTerm);
    // 入力中に古い検索結果が後から返ってきた場合は捨てる
    if (searchId === latestSearchId) {
      setResultPosts(results);
    }
  };

  // 検索語を ?q= に反映して、結果ページを URL で共有・再訪できるようにする
  const syncQueryToUrl = (searchTerm) => {
    const url = new URL(window.location.href);
    if (searchTerm) {
      url.searchParams.set('q', searchTerm);
    } else {
      url.searchParams.delete('q');
    }
    history.replaceState(null, '', url);
  };

  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setInputVal(searchTerm);
    syncQueryToUrl(searchTerm);
    runSearch(searchTerm);
  };

  onMount(() => {
    const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
    if (initialQuery) {
      setInputVal(initialQuery);
      runSearch(initialQuery);
    }
  });

  return (
    <div class="[&_mark]:bg-transparent [&_mark]:text-skin-active [&_mark]:font-bold">
      <label class="relative block">
        <span class="absolute inset-y-0 flex items-center pl-2 opacity-75">
          <i class="ri-search-line text-skin-active ml-1"></i>
        </span>
        <input
          id="search-input"
          class="block w-full rounded border border-opacity-40 bg-skin-fill text-skin-base py-3 pl-10 pr-3 placeholder:italic placeholder:text-opacity-75 focus:border-skin-accent focus:outline-none"
          placeholder="キーワードで記事の本文まで検索"
          type="search"
          name="q"
          value={inputVal()}
          onInput={handleChange}
          autofocus
        />
      </label>

      {resultPosts().length > 0 && <div class="my-2">合計<span class="px-2 font-bold text-skin-active">{resultPosts().length}</span>件の記事が見つかりました</div>}

      {inputVal() !== '' && resultPosts().length === 0 &&
        <div class="my-6">「{inputVal()}」に一致する記事は見つかりませんでした。別のキーワードをお試しください。</div>}

      {inputVal() === '' &&
        <div class="my-6">
          {categories.length > 0 &&
            <>
              <div class="mb-2"><i class="ri-folder-3-line mr-1"/>カテゴリーから探す</div>
              <div class="flex flex-wrap gap-2 mb-6">
                {categories.map(([name, count]) =>
                  <a class="border rounded-full py-1 px-3 text-sm hover:text-skin-active" href={'/category/' + name + '/'}>{name} ({count})</a>
                )}
              </div>
            </>}
          {tags.length > 0 &&
            <>
              <div class="mb-2"><i class="ri-price-tag-3-line mr-1"/>タグから探す</div>
              <div class="flex flex-wrap gap-2">
                {tags.map(([name, count]) =>
                  <a class="border rounded-full py-1 px-3 text-sm hover:text-skin-active" href={'/tags/' + name + '/'}>{name} ({count})</a>
                )}
              </div>
            </>}
        </div>}

      <div class="my-4">
        {resultPosts().map(({post, excerpt}) =>
          <>
            <a
              class="text-xl underline-offset-4 decoration-skin-base decoration-wavy hover:underline hover:decoration-sky-500 font-bold"
              href={'/' + post.collection + '/' + post.id + '/'} innerHTML={highlight(post.data.title, inputVal())}>
            </a>
            <div class="flex items-center flex-wrap">
              {post.data.date ?
                <div class="flex items-center">
                  <i class="ri-calendar-2-fill mr-1"/>
                  <div class="tag">{formatDate(post.data.date)}</div>
                </div> : ''}

              {dealLabel(post.data.category).filter(item => item !== 'uncategorized').map((categoryName) => (
                <div class="flex items-center">
                  <div class="divider-vertical"/>
                  <i class="ri-folder-2-fill mr-1"/>
                  <a href={"/category/" + categoryName + "/"}>{categoryName}</a>
                </div>
              ))}

              {dealLabel(post.data.tags).map((tagName) => (
                <div class="flex items-center">
                  <div class="divider-vertical"/>
                  <i class="ri-price-tag-3-fill mr-1"/>
                  <a href={"/tags/" + tagName + "/"}>{tagName}</a>
                </div>
              ))}
            </div>
            <p class="break-all mb-4" innerHTML={excerpt}></p>
          </>
        )}
      </div>
    </div>
  )
}
