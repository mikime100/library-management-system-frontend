import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes } from 'react';
import type { LinkProps } from 'react-router-dom';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  as?: 'button' | typeof Link;
  to?: string;
}

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button' | typeof Link;
  to?: string;
  isLoading?: boolean;
  disabled?: boolean;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    as: Component = 'button',
    isLoading = false,
    disabled = false,
    to,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      secondary: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    const classes = [
      baseStyles,
      variants[variant],
      sizes[size],
      className,
    ].filter(Boolean).join(' ');
    
    const isDisabled = disabled || isLoading;
    
    if (Component === Link) {
      const linkTo = to || '#';
      return (
        <Link
          to={linkTo}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as Omit<ButtonProps, keyof LinkProps | 'to'>)}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            children
          )}
        </Link>
      );
    }

    return (
      <button
        type="button"
        className={classes}
        disabled={isDisabled}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as Omit<ButtonProps, keyof LinkProps | 'to'>)}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
