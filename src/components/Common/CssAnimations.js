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
    justify-content: center;
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