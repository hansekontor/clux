import * as React from "react";

export const ArrowHeadLeftIcon = (props) => (
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
      d="M10 12.667 5.333 8 10 3.333"
    />
  </svg>
)
