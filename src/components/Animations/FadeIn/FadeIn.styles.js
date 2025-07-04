import { css } from 'styled-components';

const FadeIn = css`
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

export default FadeIn;
