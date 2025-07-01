import * as React from "react";

export const ArrowHeadRightIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ? props.size : "1em"}
    height={props.size ? props.size : "1em"}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 3.333 10.667 8 6 12.667"
    />
  </svg>
)