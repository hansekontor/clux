import styled from 'styled-components';
import Typography from '@components/Typography';

export const Input = styled('input').withConfig({ shouldForwardProp: (prop) => prop != 'error' })`
    height: 52px;
    width: 100%;
    min-width: 50px;
    background-color: #F6F6F6;
    border-radius: 8px;
    border: ${props => props.$error ? 'solid 0.5px red' : 'none'};
    text-indent: 12px;

    &:focus {
        border: solid 0.5px black; 
    };
`;

export const PaymentInput = styled(Input)`
	background-color: #EAEAEA;
`;

export const FormWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const WidgetBody = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 11;
    height: fit-content;
    bottom: 0;
    padding-bottom: 12px;
    background-color: #FEFFFE;
    border-radius: 12px 12px 0 0;
`;

export const PaymentForm = styled.form`
    z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
	margin-top: 30px;
	margin-bottom: 30px;
    gap: 12px;
    width: 90%;
    max-width: 100%;
`;

export const Item = styled.div`
    display: flex;
    padding-bottom: 15px;
    width: 100%;
    gap: 5%;
`;

export const FormHeader = styled(Item)`
    text-align: justify;
    justify-content: space-between;
    display: flex;
`;

export const Price = styled(Typography).attrs({ variant: 'header' })`
    text-align: right;
`;