import * as React from "react"

export const CartIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ? props.size : "1em"}
        height={props.size ? props.size : "1em"}
        viewBox="0 0 18 18"
        fill="none"
        {...props}
    >
        <g clipPath="url(#a)">
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M1.5 1.59h.98c.184 0 .276 0 .35.035.066.03.122.078.16.138.044.069.057.16.084.343l.355 2.485m0 0 .788 5.798c.1.736.15 1.104.327 1.381a1.5 1.5 0 0 0 .64.559c.298.137.669.137 1.412.137h6.418c.707 0 1.06 0 1.35-.127a1.5 1.5 0 0 0 .63-.523c.18-.26.245-.607.378-1.301l.992-5.212c.047-.244.07-.367.036-.462a.375.375 0 0 0-.164-.2c-.088-.05-.212-.05-.461-.05H3.429ZM7.5 15.84a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm6 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="currentColor" d="M0 .09h18v18H0z" />
            </clipPath>
        </defs>
    </svg>
)
