import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, type, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={`input-wrapper ${className}`}>
        {label && (
          <label className="input-label">
            {label}
            {hint && <span className="input-hint">{hint}</span>}
          </label>
        )}
        <div className={`input-container ${error ? 'input-error' : ''}`}>
          {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            type={inputType}
            className={`input ${leftIcon ? 'has-left-icon' : ''} ${isPassword || rightElement ? 'has-right-element' : ''}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="input-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {rightElement && !isPassword && (
            <span className="input-right-element">{rightElement}</span>
          )}
        </div>
        {error && <span className="input-error-message">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
