import { dealLabel } from './dealLabel';

const getUniqueCategory = (posts) => {
    const category = new Set<string>();
    posts.forEach(post => {
        dealLabel(post.data.category).filter(Boolean).forEach((item) => category.add(item));
    });
    return Array.from(category);
};

export default getUniqueCategory;
