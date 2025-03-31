import styled from 'styled-components';
import { FadeInAnimation } from '@components/CssAnimations';

// styled components
const Modal = styled.div`
    width: 95%;
    background-color: #FEFFFE;
    gap: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 0;
    border-radius: 20px;
    div, p {
        text-align: center;
    }
`;

const ModalCtn = styled.div`
    width: 100%;
    gap: 24px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    ${FadeInAnimation}
`;

const CopyboardIcon = styled.img`
    position: relative;
    top: 3px;
    margin-right: 5px;
`;

export {
    Modal, 
    ModalCtn,
    CopyboardIcon
}