import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Button = ({ children, className, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={classNames(
        'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired, // Content inside the button
  className: PropTypes.string,         // Tailwind classes for styling
  type: PropTypes.oneOf(['button', 'submit', 'reset']), // Button type
};

export default Button;
