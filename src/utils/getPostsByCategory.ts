import { dealLabel } from './dealLabel';

const getPostsByCategory = (posts, category: string) =>
  posts.filter(post => dealLabel(post.data.category).includes(category))

export default getPostsByCategory;
