import styled from "styled-components";
import { FadeIn } from '@components/Animations';

const ModalContainer = styled.div`
    bottom: 76px;
    width: 100%;
    gap: 24px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    ${FadeIn}
`;

export default ModalContainer;