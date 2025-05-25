import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      <path d="M15.94 8.06c-.33-.33-.85-.33-1.18 0L12 10.82l-2.76-2.76c-.33-.33-.85-.33-1.18 0s-.33.85 0 1.18L10.82 12l-2.76 2.76c-.33.33-.33.85 0 1.18.16.16.38.24.59.24s.43-.08.59-.24L12 13.18l2.76 2.76c.16.16.38.24.59.24s.43-.08.59-.24c.33-.33.33-.85 0-1.18L13.18 12l2.76-2.76c.33-.33.33-.85 0-1.18z" />
      <path d="M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0" fill="currentColor" />
    </svg>
  );
}
