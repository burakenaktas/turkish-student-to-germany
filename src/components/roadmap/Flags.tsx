type Props = { className?: string; title: string };

export function TurkeyFlag({ className, title }: Props) {
  return (
    <svg viewBox="0 0 60 40" role="img" aria-label={title} className={className}>
      <rect width="60" height="40" rx="4" fill="#E30A17" />
      <g fill="#fff">
        <circle cx="24" cy="20" r="8.5" />
        <circle cx="27.5" cy="20" r="6.8" fill="#E30A17" />
        <path d="M38.4 20l-3.9 1.3 2.4 3.3v-4.1l-4 1.3 2.4-3.3-2.4-3.3 4 1.3v-4.1l-2.4 3.3 3.9 1.3-3.9 1.3z" />
        <path d="M37.2 14.6l1.1 3.3 3.4.1-2.7 2.1 1 3.3-2.8-2-2.8 2 1-3.3-2.7-2.1 3.4-.1z" />
      </g>
    </svg>
  );
}

export function GermanyFlag({ className, title }: Props) {
  return (
    <svg viewBox="0 0 60 40" role="img" aria-label={title} className={className}>
      <clipPath id="de-clip">
        <rect width="60" height="40" rx="4" />
      </clipPath>
      <g clipPath="url(#de-clip)">
        <rect width="60" height="13.34" fill="#000" />
        <rect y="13.34" width="60" height="13.33" fill="#DD0000" />
        <rect y="26.67" width="60" height="13.33" fill="#FFCE00" />
      </g>
    </svg>
  );
}
