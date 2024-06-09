import { FaCircleExclamation } from 'react-icons/fa6';
import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  name: string;
  label?: string;
  errors?: string[];
  errorId: string;
};

export function Input({
  className,
  id,
  name,
  label,
  errors,
  errorId,
  ...props
}: InputProps) {
  const hasErrors = !!errors?.length;
  console.log(errors);
  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={id}
          className="sr-only block font-medium text-white mb-3"
        >
          {label}
        </label>
      ) : null}

      <div className="relative rounded-lg shadow-sm">
        <input
          name={name}
          id={id}
          className={clsx(
            'block w-full rounded-xl border-0 py-3 pr-10 ring-1 ring-inset focus:ring-2 focus:ring-inset bg-zinc-800',
            hasErrors
              ? 'text-red-500 ring-red-700 placeholder:text-red-400 focus:ring-red-500'
              : 'text-white ring-zinc-800 placeholder:text-zinc-500 focus:ring-amber-600',
          )}
          aria-invalid={hasErrors || props['aria-invalid']}
          aria-describedby={hasErrors ? errorId : props['aria-describedby']}
          {...props}
        />
        {hasErrors ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <FaCircleExclamation
              className="h-5 w-5 text-red-700"
              aria-hidden="true"
            />
          </div>
        ) : null}
      </div>

      {hasErrors ? (
        <p className=" mt-2 text-red-600" id={errorId}>
          {errors}
        </p>
      ) : null}
    </div>
  );
}
