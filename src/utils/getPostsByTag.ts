import { dealLabel } from './dealLabel';

const getPostsByTag = (posts, tag: string) =>
  posts.filter(post => dealLabel(post.data.tags).includes(tag))
export default getPostsByTag;
