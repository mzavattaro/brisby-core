import type { NextPage } from 'next';
import ReviewList from '../../components/books/ReviewList';
import data from '../../components/books/posts.json';
import type { Post } from '../../components/books/ReviewList';

const posts = data.posts as Post[];

const BooksPage: NextPage = () => {
  const postsByCategories = (bookPosts: Post[]) => {
    const categories = bookPosts.map((moviePost) => moviePost.category);
    const uniqueCategories = [...new Set(categories)];

    return uniqueCategories.map((category) => ({
      filter: category,
      posts: bookPosts.filter((post) => post.category === category),
    }));
  };

  const postsByReviewers = (bookPosts: Post[]) => {
    const reviewers = bookPosts.map((bookPost) => bookPost.reviewed_by.name);
    const uniqueReviewers = [...new Set(reviewers)];

    return uniqueReviewers.map((reviewer) => ({
      filter: reviewer,
      posts: bookPosts.filter((post) => post.reviewed_by.name === reviewer),
    }));
  };

  const postsByTags = (bookPosts: Post[]) => {
    const tags = bookPosts.flatMap((bookPost) =>
      bookPost.tags.flatMap((tag) => tag.split(','))
    );
    const uniqueTags = [...new Set(tags)];

    return uniqueTags.map((tag) => ({
      filter: tag,
      posts: bookPosts.filter((post) => post.tags.includes(tag)),
    }));
  };

  return (
    <div>
      <ReviewList
        postsByCategories={postsByCategories(posts)}
        postsByReviewers={postsByReviewers(posts)}
        postsByTags={postsByTags(posts)}
      />
    </div>
  );
};

export default BooksPage;
