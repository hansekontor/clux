import { css } from 'styled-components';

const SlideIn = css`
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

export default SlideIn;