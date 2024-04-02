// node modules
import React from "react";
import styled from "styled-components";

// styled css components
const FooterCtn = styled.div`
    z-index: 2;
    color: ${props => props.contrast ? '#ffffff' : props.theme.footer.color};
    align-items: center;
    justify-content: center;
    position: fixed;
    width: inherit;
    bottom: 0;
    background: transparent;

    a {
        color: black;

        :hover {
            color: grey;
        }
    }
`;

const Footer = () => {
    return (
        <FooterCtn>
            <div>2023 Operator Co - Terms and Conditions - Privacy Policy</div>
        </FooterCtn>
    )
}

export default Footer;