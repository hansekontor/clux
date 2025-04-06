import { Scrollable } from '@components/Common';
import styled from 'styled-components';

const FlexGrow = styled(Scrollable)`
    background-color: ${props => props.theme.app.background};
`;

export default FlexGrow;