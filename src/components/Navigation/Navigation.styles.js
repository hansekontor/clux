import styled from "styled-components";

export const StyledAgreeHeader = styled.div`
    width: 100%;
    background-color: ${props => props.theme.checkout.navigation.background};
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid ${props => props.theme.checkout.methods.border};
    margin-top: 0px;
`;

export const StyledTitle = styled.div`
    font-family:  Helvetica;
    font-weight: 600;
`;

export const StyledNavigation = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-left: 3%;
`;

export const StyledMerchant = styled.div`
    display: flex;
    flex-direction: row;
    gap: 3px;
    padding-right: 6%;
`;

export const StyledMerchantLabel = styled.div`
    font-family: "Inter-Regular", Helvetica;
    font-size: 14px;
    font-weight: 400;`
;

export const StyledMerchantName = styled.div`
    font-family: "Inter-SemiBold", Helvetica;
    font-size: 14px;
    font-weight: 600;
`;