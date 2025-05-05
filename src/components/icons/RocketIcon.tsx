import type { SVGProps } from 'react';

export function RocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5" // Thin lines
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 16.5c-1.5 1.5-3 1.5-4.5 0" />
      <path d="M13.5 4.5c1.5-1.5 1.5-3 0-4.5" />
      <path d="M19.5 11.5c1.5 1.5 1.5 3 0 4.5" />
      <path d="M10.5 13.5c-1.5 1.5-3 1.5-4.5 0" />
      <path d="m4.5 4.5 15 15" />
      <path d="M14.5 4.5 12 7 9.5 9.5 7 12 4.5 14.5" /> {/* Simplified rocket body */}
      <path d="M16.5 7.5 12 12" /> {/* Simplified trail */}
    </svg>
  );
}
