import styled, { css } from 'styled-components';

const EnfoldAnimation = css`
    @keyframes enfold {
        0% {
            transform: scaleY(.5);
            transform-origin: 50% 0;
        }
        100% {
            transform: scaleY(1);
            transform-origin: 50% 0;
        }
}`;

export const Enfold = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    width: inherit;
    animation: ${props => props.animate ? 'enfold .4s cubic-bezier(0.39, 0.5, 0.5, 1) both' : 'none'};
    ${EnfoldAnimation}
}`;

export const RollupAnimation = css`
    animation: ${props => props.animate ? 'rollup .3s cubic-bezier(0.39, 0.5, 0.5, 1) both' : 'none'};

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

export const SlideInAnimation = css`
    @keyframes slide-in-from-top {
        0% {
            transform: translateY(-100px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

export const FadeOutAnimationLong = css`
    visibility: ${props => props.fadeOut ? "hidden" : "visible"};
    opacity: ${props => props.fadeOut ? 0 : 1};
    transition: ${props => props.fadeOut ? "visibility 0s 2s, opacity 2s linear" : "none"};
`;
export const FadeOutAnimationShort = css`
    visibility: ${props => props.fadeOut ? "hidden" : "visible"};
    opacity: ${props => props.fadeOut ? 0 : 1};
    transition: ${props => props.fadeOut ? "visibility 0s 0.5s, opacity 0.3s linear" : "none"};
`;
export const FadeInAnimation = css`
    animation: fade-in 1s cubic-bezier(0.4, 0.6, 0.6, 1) both;
    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;

export const RollUp = styled.div`
    max-width: 480px;
    width: 100vh;
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

export const ScaleOut = styled.div`
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