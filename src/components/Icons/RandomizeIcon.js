import * as React from "react";

export const RandomizeIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ? props.size : "1em"}
        height={props.size ? props.size : "1em"}
        viewBox="0 0 25 25"
        fill="none"
        {...props}
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.5 4.965v5h.582m15.356 2a8.001 8.001 0 0 0-15.356-2m0 0H9.5m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15.5"
        />
    </svg>
)
