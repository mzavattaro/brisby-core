import type { FC, ReactNode } from 'react';
import { classNames } from '../utils/classNames';

const Button: FC<{
  variant: 'primary' | 'secondary' | 'tertiary' | 'none';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: ReactNode;
  type: 'button' | 'submit';
  disabled?: boolean;
}> = (props) => {
  const { className, variant, size, type, children, disabled } = props;

  return (
    <button
      disabled={disabled}
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={classNames(
        'inline-flex items-center border border-transparent font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        className,
        variant === 'primary' &&
          'rounded bg-indigo-600 text-white hover:bg-indigo-700',
        variant === 'secondary' &&
          'rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
        variant === 'tertiary' &&
          'rounded border-gray-300 bg-white hover:bg-gray-50',
        variant === 'none' && '',
        size === 'xs' && 'px-2.5 py-1.5 text-xs',
        size === 'sm' && 'px-3 py-2 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-4 py-2 text-base',
        size === 'xl' && 'px-6 py-3 text-base',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  );
};

export default Button;
