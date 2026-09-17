/**
 * Physics Lab mark — an orbit around a nucleus.
 */
export default function LogoMark({ size = 26, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="13"
        cy="13"
        rx="11"
        ry="4.6"
        stroke="rgba(148,163,184,0.55)"
        strokeWidth="1.1"
        transform="rotate(-24 13 13)"
      />
      <ellipse
        cx="13"
        cy="13"
        rx="11"
        ry="4.6"
        stroke="rgba(148,163,184,0.35)"
        strokeWidth="1.1"
        transform="rotate(38 13 13)"
      />
      <circle cx="13" cy="13" r="2.4" fill="#FFB224" />
    </svg>
  );
}
