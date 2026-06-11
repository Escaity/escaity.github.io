import {createSignal} from "solid-js";
import {dealLabel} from "../utils/dealLabel.ts"
import {formatDate} from "../utils/formatDate.ts";

const toSearchText = (value) => String(value || '').toLowerCase();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function Search(props) {
  const [inputVal, setInputVal] = createSignal('')
  const [resultPosts, setResultPosts] = createSignal([])

  const handleChange = (e) => {
    const searchTerm = e.target.value;
    const normalizedSearchTerm = toSearchText(searchTerm);

    setInputVal(searchTerm)
    if (searchTerm === '') {
      setResultPosts([])
    } else {
      let filterBlogs = props.posts.filter(post =>
        toSearchText(post.data.title).includes(normalizedSearchTerm)
        || toSearchText(post.data.description).includes(normalizedSearchTerm)
      )
      const reg = new RegExp(escapeRegExp(searchTerm), 'gi')
      const highlightedBlogs = filterBlogs.map((blog) => {
        const data = {...blog.data};
        data.title = data.title.replace(reg, (match) => {
          return `<span class="text-skin-active font-bold">${match}</span>`
        })
        if (data.description) {
          data.description = data.description.replace(reg, (match) => {
            return `<span class="text-skin-active font-bold">${match}</span>`
          })
        } else {
          data.description = ''
        }
        return {...blog, data}
      })
      setResultPosts(highlightedBlogs)
    }
  }

  return (
    <div>
      <label class="relative block">
        <span class="absolute inset-y-0 flex items-center pl-2 opacity-75">
          <i class="ri-search-line text-skin-active ml-1"></i>
        </span>
        <input
          id="search-input"
          class="block w-full rounded border border-opacity-40 bg-skin-fill text-skin-base py-3 pl-10 pr-3 placeholder:italic placeholder:text-opacity-75 focus:border-skin-accent focus:outline-none"
          placeholder="タイトルまたは概要のキーワードを入力"
          type="text"
          name="search"
          value={inputVal()}
          onInput={handleChange}
          autofocus
        />
      </label>

      {resultPosts().length > 0 && <div class="my-2">合計<span class="px-2 font-bold text-skin-active">{resultPosts().length}</span>件の記事が見つかりました</div>}

      <div class="my-4">
        {resultPosts().map(post =>
          <>
            <a
              class="text-xl underline-offset-4 decoration-skin-base decoration-wavy hover:underline hover:decoration-sky-500 font-bold"
              href={'/' + post.collection + '/' + post.id} innerHTML={post.data.title}>
            </a>
            <div class="flex items-center">
              {post.data.date ?
                <div class="flex items-center cursor-pointer">
                  <i class="ri-calendar-2-fill mr-1"/>
                  <div class="tag">{formatDate(post.data.date)}</div>
                </div> : ''}

              {dealLabel(post.data.category).filter(item => item !== 'uncategorized').map((categoryName, categoryNameIndex) => (
                <div class="flex  items-center  cursor-pointer">
                  <div class="divider-vertical"/>
                  <i class="ri-folder-2-fill mr-1"/>
                  <a href={"/category/" + categoryName}>{categoryName}</a>
                </div>
              ))}

              {dealLabel(post.data.tags).map((tagName, tagIndex) => (
                <div class="flex  items-center  cursor-pointer">
                  <div class="divider-vertical"/>
                  <i class="ri-price-tag-3-fill mr-1"/>
                  <a href={"/tags/" + tagName}>{tagName}</a>
                </div>
              ))}
            </div>
            <p class="break-all mb-4" innerHTML={post.data.description}></p>
          </>
        )}
      </div>
    </div>
  )
}
