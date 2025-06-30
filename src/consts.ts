// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

/**
 * title {string} website title
 * favicon {string} website favicon url
 * description {string} website description
 * author {string} author
 * avatar {string} Avatar used in the profile
 * motto {string} used in the profile
 * url {string} Website link
 * recentBlogSize {number} Number of recent articles displayed in the sidebar
 * archivePageSize {number} Number of articles on archive pages
 * postPageSize {number} Number of articles on blog pages
 * feedPageSize {number} Number of articles on feed pages
 */
export const site = {
  title: 'AIcicle Records', // required
  favicon: '/favicon.svg', // required
  description: 'AIと対話記録をメモしてます',
  author: "Escaity", // required
  avatar: '/avatar.png', // required
  motto: 'True wealth is experience.',
  url: 'https://escaity.github.io',
  recentBlogSize: 5,
  archivePageSize: 25,
  postPageSize: 6,
  feedPageSize: 10,
}

/**
 * lang {string} Default website language
 * codeFoldingStartLines {number}
 * ga {string|false}
 */
export const config = {
  lang: 'ja', // en | zh-cn
  codeFoldingStartLines: 16, // Need to re-run the project to take effect
  ga: false // If you want to integrate with Google Analytics, just enter your GA-ID here.
}

/**
 * Navigator
 * name {string}
 * iconClass {string} icon style
 * href {string}  link url
 * target {string} optional "_self|_blank" open in current window / open in new window
 */
export const categories = [
  {
    name: "Blog",
    iconClass: "ri-draft-line",
    href: "/blog/1",
  },
  {
    name: "Archive",
    iconClass: "ri-archive-line",
    href: "/archive/1",
  },
  {
    name: "About",
    iconClass: "ri-user-line",
    href: "/about",
  },
  {
    name: "Search",
    iconClass: "ri-search-line",
    href: "/search",
  },

]

/**
 * Personal link address
 */
export const infoLinks = [
  {
    icon: 'ri-soundcloud-fill',
    name: 'soundcloud',
    outlink: 'https://soundcloud.com/escaity',
  },
  {
    icon: 'ri-github-fill',
    name: 'github',
    outlink: 'https://github.com/escaity',
  },
  {
    icon: 'ri-steam-fill',
    name: 'steam',
    outlink: 'https://steamcommunity.com/profiles/76561198258227754/',
  }
]
