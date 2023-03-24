import { XMarkIcon } from '@heroicons/react/24/outline';
import type { FC } from 'react';

const SignupToast: FC = () => (
  <div className="fixed left-0 right-0 top-4 z-50 mx-auto flex h-11 max-w-max place-content-between items-center rounded-full bg-sky-500 px-8 text-sm font-semibold text-white drop-shadow-lg">
    <div className="mr-4 flex-auto">
      <span>Sign up here to receive notifications</span>
    </div>
    <XMarkIcon className="block h-6 w-6" />
  </div>
);

export default SignupToast;
