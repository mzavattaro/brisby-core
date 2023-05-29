import type { FC } from 'react';

const LoadingSpinner: FC = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-700 motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  </div>
);

export default LoadingSpinner;
