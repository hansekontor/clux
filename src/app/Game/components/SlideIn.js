import styled from "styled-components";
import { SlideIn as SlideInAnimation } from '@components/Animations';

const SlideIn = styled.div`
    position: absolute;
    z-index: 200;
    top: 0;
    animation: slide-in-from-top 0.5s cubic-bezier(0.24, 0.48, 0.47, 0.95);

    ${SlideInAnimation};
`;

export default SlideIn;