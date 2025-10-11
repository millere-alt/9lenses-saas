import React from 'react';

/**
 * Reusable Card component for consistent layout and styling
 * @param {React.ReactNode} children - Card content
 * @param {string} title - Optional card title
 * @param {React.ReactNode} header - Optional custom header content
 * @param {React.ReactNode} footer - Optional footer content
 * @param {'default'|'elevated'|'outlined'} variant - Card variant
 * @param {string} className - Additional CSS classes
 * @param {boolean} hoverable - Add hover effect
 * @param {function} onClick - Click handler for clickable cards
 */
const Card = React.memo(({
  children,
  title,
  header,
  footer,
  variant = 'default',
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-lg overflow-hidden transition-all duration-200';

  const variantStyles = {
    default: 'border border-gray-200 shadow-sm',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-[#0176D3]'
  };

  const hoverStyles = hoverable || onClick ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

  const handleClick = onClick ? (e) => {
    onClick(e);
  } : undefined;

  const handleKeyPress = onClick ? (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  } : undefined;

  return (
    <div
      className={combinedClassName}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {/* Custom Header */}
      {header && (
        <div className="border-b border-gray-200 bg-gray-50">
          {header}
        </div>
      )}

      {/* Title Header */}
      {title && !header && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
