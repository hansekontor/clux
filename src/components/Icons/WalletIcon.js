import * as React from "react";

export const WalletIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ? props.size : "1em"}
    height={props.size ? props.size : "1em"}
    fill="currentColor"
    viewBox="0 0 32 32"
    {...props}
  >
    <path d="M28.255 9.839H6.714a1 1 0 1 1 0-2h17.572v-3.75c0-.533-.239-1.03-.655-1.363a1.741 1.741 0 0 0-1.475-.34L3.362 6.606A1.737 1.737 0 0 0 2 8.309v19.603c0 .962.783 1.746 1.745 1.746h24.51c.962 0 1.745-.783 1.745-1.746V11.584c0-.962-.783-1.745-1.745-1.745zm-3.149 11.692c-.935 0-1.695-.761-1.695-1.696s.761-1.696 1.695-1.696c.936 0 1.696.761 1.696 1.696s-.76 1.696-1.696 1.696z" />
  </svg>
);
