import * as React from "react";

export const PrivacyIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    width={props.size ? props.size : "1em"}
    height={props.size ? props.size : "1em"}
    {...props}
  >
    <path d="M14 21.51V19H9a1 1 0 0 1 0-2h5.18A3 3 0 0 1 16 15.18l5.5-2a3 3 0 0 1 2.05 0l1.48.54V5a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h12.12A10.85 10.85 0 0 1 14 21.51ZM9 7h10a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2Zm0 5h10a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2Zm3 13H9a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm16.34-7.94-5.5-2a1 1 0 0 0-.68 0l-5.5 2A1 1 0 0 0 16 18v3.51a8.86 8.86 0 0 0 5.82 8.3 1.79 1.79 0 0 0 .68.13 2 2 0 0 0 .68-.12A8.88 8.88 0 0 0 29 21.51V18a1 1 0 0 0-.66-.94Zm-2.63 4.65-3 3a1 1 0 0 1-1.42 0l-2-2a1 1 0 0 1 1.42-1.42l1.29 1.3 2.29-2.3a1 1 0 0 1 1.42 1.42Z" />
  </svg>
);
