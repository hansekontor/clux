import styled from "styled-components";

export const StyledBalance = styled.div`
    width: 112px;
    height: 40px;
    border-radius: 12px;
    // background: ${props => props.theme.balance.background};
    color: ${props => props.theme.balance.color};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Helvetica;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 2px;
    position: relative;
    background: linear-gradient(180deg, #151224 0%, #151224 9.5%, #645F7F 35%, #E3E3E3 100%);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: auto;
        left: auto;
        bottom: auto;
        right: auto;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        z-index: 1;
        box-sizing: border-box;
        border-radius: 10px;
        background: ${props => props.theme.balance.background};
    }

    & > * {
        position: relative;
        z-index: 2;
    }

    & > span {
        opacity: 0.5;

        &.active {
            opacity: 1;
        }
    }
`;