import * as React from "react";

export const ArrowRightIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ? props.size : "1em"}
        height={props.size ? props.size : "1em"}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12.35 3.952a1.2 1.2 0 0 1 1.697 0l7.2 7.2a1.2 1.2 0 0 1 0 1.697l-7.2 7.2a1.2 1.2 0 1 1-1.697-1.697L17.5 13.2H3.598a1.2 1.2 0 0 1 0-2.4h13.903L12.35 5.65a1.2 1.2 0 0 1 0-1.697Z"
            clipRule="evenodd"
        />
    </svg>
)
