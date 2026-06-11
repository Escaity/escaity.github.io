import { dealLabel } from './dealLabel'

const getCountByCategory = (posts) => {
  let category: string[] = [];
  posts.forEach(post => {
    category = [...category, ...dealLabel(post.data.category)].filter(Boolean)
  });
  let result = category.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {})
  if(result['uncategorized']){
    let num = result['uncategorized']
    delete result['uncategorized']
    result['uncategorized'] = num
  }
  return result;
};

export default getCountByCategory;
