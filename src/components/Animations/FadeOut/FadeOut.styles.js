import { css } from 'styled-components';

export const FadeOutLong = css`
    visibility: ${props => props.$fadeOut ? "hidden" : "visible"};
    opacity: ${props => props.$fadeOut ? 0 : 1};
    transition: ${props => props.$fadeOut ? "visibility 0s 2s, opacity 2s linear" : "none"};
`;

export const FadeOutShort = css`
    visibility: ${props => props.$fadeOut ? "hidden" : "visible"};
    opacity: ${props => props.$fadeOut ? 0 : 1};
    transition: ${props => props.$fadeOut ? "visibility 0s 0.5s, opacity 0.3s linear" : "none"};
`;