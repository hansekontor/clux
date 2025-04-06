import styled from "styled-components";
import { FadeOutShort } from '@components/Animations';
import { StyledContainer } from '@components/Layout/Layout.styles';

const FadeOut = styled(StyledContainer)`
    box-shadow: none;
    animate: fade-out 1s ease-out both;
    ${FadeOutShort}    
`;

export default FadeOut;