import styled from "styled-components";

export const StyledLoadingBlock = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    flex-direction: column;
    svg {
        width: 50px;
        height: 50px;
        fill: #000000;
    }
`;

// Footer Icons
export const StyledMediumDarkCircle = styled.div`
    background-color: #1A1826;
    border-radius: 20px;
    height: 40px;
    width: 40px;
    cursor: pointer;
    text-align: center;
    cursor: pointer;    
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;

export const StyledMediumCircleIcon = styled.img`
    width: 24px;
    height: 24px;
    position: absolute;
`;

export const StyledAlertContainer = styled.div`
    background-color: red;
    border-radius: 40px;
    position: absolute;
    top: 0px;
    left: 80%;
    height: 12px;
    width: 12px;
    display: flex; 
    justify-content: center;
    align-items: center;    
`;

export const StyledIndicator = styled.div`
    font-size: 9px;
    color: white;
    font-weight: 600;
    font-family: Helvetica;
`;

// KYC icons
export const StyledLargeCircle = styled.div`
    background-color: #D0CED8;
    border-radius: 177px;
    height: 64px;
    width: 64px;
    cursor: pointer;
    cursor: pointer;
    text-align: center;
    cursor: pointer;    
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;

export const StyledMediumWhiteCircle = styled(StyledMediumDarkCircle)`
    background-color: #FFFFFF;
`;

// wallet icons
export const StyledSmallCircle = styled.div`
    position: relative;
    background-color: #D0CED8;
    border-radius: 20px;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledSmallGreenCircle = styled(StyledSmallCircle)`
    background-color: #D2EFD0;
`;

export const StyledSmallYellowCircle = styled(StyledSmallCircle)`
    background-color: #FBEDD2;
`;

export const StyledCardIcons = styled.div`
    margin: auto;
    gap: 12px;
    border-radius: 12px;
    background-color: #ffffff;
    padding: 7px;
    width: fit-content;
    display: flex;
`;