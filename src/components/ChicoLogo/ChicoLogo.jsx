const ChicoLogo = ({ size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Letter C stylized */}
      <path
        d="M28 12C28 12 24 8 18 8C12 8 6 13 6 20C6 27 12 32 18 32C24 32 28 28 28 28"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* AI spark/accent */}
      <circle cx="32" cy="10" r="3" fill="currentColor" />
      <path
        d="M32 6V3M32 14V17M28 10H25M36 10H39"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ChicoLogo;
