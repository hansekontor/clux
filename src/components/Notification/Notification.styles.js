import styled from "styled-components";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export const StyledNotification =  styled.div`    
	height: 50px;    
	padding: 0 17px;    
	gap: 10px;
    border-radius: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: ${props => props.$color ? props.$color : '#FFFFFF'};
`;

export const StyledCheckIcon = styled(CheckCircleOutlined)`
    color: #FFFFFF;
`;

export const StyledErrorIcon = styled(CloseCircleOutlined)`
    color: #002152;
`;

export const StyledInfoIcon = styled(ExclamationCircleOutlined)`
    color: #002152;
`;

export const StyledText = styled. div`
    color: ${props => props.$color ? props.$color : '#002152'};
    font-size: 18px;
    font-weight: 600;
`;