import styled from "styled-components";

export const StyledFooter = styled.div`
    background-color: ${props => props.theme.footer.background};
    align-items: center;
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    width: inherit;
    border-radius: 16px 16px 0 0;
    padding: 18px 0;
`;