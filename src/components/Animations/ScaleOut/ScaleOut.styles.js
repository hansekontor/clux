import styled from "styled-components";

const ScaleOut = styled.div`
    -webkit-animation: ${props => props.$animate ? "scale-out 0.1s cubic-bezier(0.5, 0.08, 0.6, 0.5) both" : "none"};
    animation: ${props => props.$animate ? "scale-out 0.1s cubic-bezier(0.5, 0.08, 0.6, 0.5) both" : "none"};

    @-webkit-keyframes scale-out {
        0% {
            -webkit-transform: scaleY(1);
                transform: scaleY(1);
            opacity: 1;
        }
        100% {
            -webkit-transform: scaleY(0);
                transform: scaleY(0);
            opacity: 1;
        }
    }

    @keyframes scale-out {
        0% {
            -webkit-transform: scaleY(1);
                transform: scaleY(1);
            opacity: 1;
        }
        100% {
            -webkit-transform: scaleY(0);
                transform: scaleY(0);
            opacity: 1;
        }
    }
`;

export default ScaleOut;