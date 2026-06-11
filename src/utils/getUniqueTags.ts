import { dealLabel } from './dealLabel';

const getUniqueTags = (posts) => {
    const tags = new Set<string>();
    posts.forEach(post => {
        dealLabel(post.data.tags).filter(Boolean).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
};

export default getUniqueTags;
