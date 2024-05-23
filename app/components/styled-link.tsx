import {
  Link as RemixLink,
  LinkProps as RemixLinkProps,
} from '@remix-run/react';
import clsx from 'clsx';

export function StyledLink({ className, ...props }: RemixLinkProps) {
  return (
    <RemixLink
      className={clsx(
        'text-amber-600 hover:text-amber-500 font-medium',
        className,
      )}
      {...props}
    />
  );
}
