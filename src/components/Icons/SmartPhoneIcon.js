import * as React from "react"

export const SmartPhoneIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ? props.size : "1em"}
    height={props.size ? props.size : "1em"}
    viewBox="0 0 15 20"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.75 0A2.25 2.25 0 0 1 12 2.25v15.5A2.25 2.25 0 0 1 9.75 20h-7.5A2.25 2.25 0 0 1 0 17.75V2.25A2.25 2.25 0 0 1 2.25 0h7.5Zm0 1.5h-7.5a.75.75 0 0 0-.75.75v15.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-.75-.75Zm-2.501 14A.75.75 0 0 1 7.25 17l-2.5.004a.75.75 0 0 1-.002-1.5l2.5-.004Z"
    />
  </svg>
)
