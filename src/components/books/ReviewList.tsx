import type { FC } from 'react';
import React, { useState } from 'react';

type ReviewAuthor = {
  id: string;
  name: string;
};

export type Post = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  reviewed_by: ReviewAuthor;
};

type ReviewListProps = {
  postsByCategories: { filter: string; posts: Post[] }[];
  postsByReviewers: { filter: string; posts: Post[] }[];
  postsByTags: { filter: string; posts: Post[] }[];
};

type ReviewGroupProps = {
  filter: string;
  posts: Post[];
};

type ReviewGroupBy = 'category' | 'tag' | 'reviewer';

const ReviewGroup: FC<ReviewGroupProps> = ({ filter, posts }) => (
  <div>
    <h2 className="text-lg font-semibold">{filter}</h2>
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  </div>
);

const ReviewList: FC<ReviewListProps> = ({
  postsByCategories,
  postsByReviewers,
  postsByTags,
}) => {
  const [groupBy, setGroupBy] = useState<ReviewGroupBy>('category');

  const handleGroupByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGroupBy(event.target.value as ReviewGroupBy);
  };

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select value={groupBy} onChange={handleGroupByChange}>
        <option value="category">Category</option>
        <option value="tag">Tag</option>
        <option value="reviewer">Reviewer</option>
      </select>
      <h1 className="text-xl font-bold">Posts</h1>

      {groupBy === 'category' &&
        postsByCategories.map((postByCategory) => (
          <ReviewGroup
            key={postByCategory.filter}
            filter={postByCategory.filter}
            posts={postByCategory.posts}
          />
        ))}

      {groupBy === 'tag' &&
        postsByTags.map((postByTag) => (
          <ReviewGroup
            key={postByTag.filter}
            filter={postByTag.filter}
            posts={postByTag.posts}
          />
        ))}

      {groupBy === 'reviewer' &&
        postsByReviewers.map((postByReviewer) => (
          <ReviewGroup
            key={postByReviewer.filter}
            filter={postByReviewer.filter}
            posts={postByReviewer.posts}
          />
        ))}
    </div>
  );
};

export default ReviewList;
