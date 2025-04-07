import styled from "styled-components";

// export const RollupAnimation = css`
//     animation: ${props => props.$animate ? 'rollup .3s cubic-bezier(0.39, 0.5, 0.5, 1) both' : 'none'};

//     @keyframes rollup {
//             0% {
//                     transform: scaleY(0.4);
//                     transform-origin: 0% 100%;
//             }
//             100% {
//                     transform: scaleY(1);
//                     transform-origin: 0% 100%;
//             }
//     }
// `;

const RollUp = styled.div`
    max-width: 480px;
    width: 100%;
    left: 0;
    bottom: 0px;
    background: #fff;
    border: 1px solid #666;
    border-radius: 6px 6px 0 0;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
    position: fixed;
    height: fit-content;

    div {
        width: inherit;
        height: inherit;
    }

    animation: ${props => props.$animate ? 'rollup .3s cubic-bezier(0.39, 0.5, 0.5, 1) both' : 'none'};

    @keyframes rollup {
        0% {
                transform: scaleY(0.4);
                transform-origin: 0% 100%;
        }
        100% {
                transform: scaleY(1);
                transform-origin: 0% 100%;
        }
    }
`;

export default RollUp;