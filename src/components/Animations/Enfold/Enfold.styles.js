import styled, { css } from 'styled-components';

export const EnfoldAnimation = css`
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

const Enfold = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    width: inherit;
    animation: ${props => props.$animate ? 'enfold .4s cubic-bezier(0.39, 0.5, 0.5, 1) both' : 'none'};
    ${EnfoldAnimation}
}`;

export default Enfold;