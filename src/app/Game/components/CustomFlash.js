import styled from "styled-components";
import { Flash } from 'react-ruffle';

const CustomFlash = styled(Flash)`
    position: absolute;
    visibility: ${props => props.$hidden ? "hidden" : "visible"};
`;

export default CustomFlash;