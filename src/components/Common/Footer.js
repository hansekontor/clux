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
            <div>Terms of Service - Privacy Policy</div>
            {/* Terms of Service - Privacy Policy */}
        </FooterCtn>
    )
}

export default Footer;