import type { NextPage } from 'next';
import ReviewList from '../../components/movies/ReviewList';
import data from '../../components/movies/posts.json';
import type { Post } from '../../components/movies/ReviewList';

const posts = data.posts as Post[];

const MoviesPage: NextPage = () => {
  const postsByCategories = (moviePosts: Post[]) => {
    const categories = moviePosts.map((moviePost) => moviePost.category);
    const uniqueCategories = [...new Set(categories)];

    return uniqueCategories.map((category) => ({
      filter: category,
      posts: moviePosts.filter((post) => post.category === category),
    }));
  };

  const postsByReviewers = (moviePosts: Post[]) => {
    const reviewers = moviePosts.map((moviePost) => moviePost.reviewed_by.name);
    const uniqueReviewers = [...new Set(reviewers)];

    return uniqueReviewers.map((reviewer) => ({
      filter: reviewer,
      posts: moviePosts.filter((post) => post.reviewed_by.name === reviewer),
    }));
  };

  const postsByTags = (moviePosts: Post[]) => {
    const tags = moviePosts.flatMap((moviePost) =>
      moviePost.tags.flatMap((tag) => tag.split(','))
    );
    const uniqueTags = [...new Set(tags)];

    return uniqueTags.map((tag) => ({
      filter: tag,
      posts: moviePosts.filter((post) => post.tags.includes(tag)),
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

export default MoviesPage;
