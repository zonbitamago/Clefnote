import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// 全音符 (white, no stem)
export function WholeNoteIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <ellipse cx="12" cy="12" rx="6" ry="4" />
    </svg>
  );
}

// 2分音符 (white, with stem)
export function HalfNoteIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <ellipse cx="10" cy="17" rx="5" ry="3.5" />
      <line x1="15" y1="17" x2="15" y2="4" />
    </svg>
  );
}

// 4分音符 (filled, with stem)
export function QuarterNoteIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <ellipse cx="10" cy="17" rx="5" ry="3.5" />
      <line x1="15" y1="17" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// 8分音符 (filled, with stem and one flag)
export function EighthNoteIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <ellipse cx="9" cy="18" rx="5" ry="3.5" />
      <line x1="14" y1="18" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14 4 C18 6, 19 10, 17 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 16分音符 (filled, with stem and two flags)
export function SixteenthNoteIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <ellipse cx="9" cy="18" rx="5" ry="3.5" />
      <line x1="14" y1="18" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14 4 C18 6, 19 9, 17 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 8 C18 10, 19 13, 17 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 休符 (quarter rest)
export function RestIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 4 L10 9 L14 12 C12 14, 10 16, 10 18 C10 20, 12 21, 14 20" />
    </svg>
  );
}
