import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { Checkbox } from 'antd';

import Typography from '@components/Typography';
import { Scrollable, Background } from '@components/Common';

const PrimaryFlexGrow = styled(Scrollable)`
    background-color:${props => props.theme.checkout.payment.background};
`;
const SecondaryFlexGrow = styled(Scrollable)`
	background-color: ${props => props.theme.checkout.background};
`;

const PrimaryFooterBackground = styled(Background)`
    background-color:${props => props.theme.checkout.payment.background};
`;
const SecondaryFooterBackground = styled(Background)`
	background-color: ${props => props.theme.checkout.background};
`;
const InfoText = styled.p`
    width: 90%;
    font-size: 15px;
    line-height: 150%;
    color: ${props => props.theme.checkout.text};
    text-align: justify;
    hyphens: auto;
    text-align-last: none;
	margin: 0;
`;
const HeaderText = styled.div`
    font-size: 24px;
    font-weight: 600;
    margin: 12px 0;
    text-align: left;
	margin: 12px 0 0 0;
`;
const PaymentHeader = styled(HeaderText)`
	width: 100%;
`;
const AccountForm = styled.form`
    width: 90%;
    padding-bottom: 12px;
	gap: 12px;
	display: flex;
	flex-direction: column;
`;
const ErrorMessage = styled(Typography).attrs({
	variant: "textItem"
})`
	background-color: ${props => props.theme.error.background};
	color: ${props => props.theme.error.color};
	display: flex;
	justify-content: center;
	align-items: center;
`;
const PaymentMethod = styled(ErrorMessage)`
	background-color: ${props => props.$active ? props.theme.checkout.methods.active.background : props.theme.checkout.methods.inactive.background};
	color: ${props => props.$active ? props.theme.checkout.methods.active.color : props.theme.checkout.methods.inactive.color};
	border-width: 1px;
	border-style: solid;
	border-color: ${props => props.theme.checkout.methods.border};
`;
const WideCreatableSelect = styled(CreatableSelect)`
	width: 100%;
`;
const selectStyle = {
	control: base => ({
		...base,
		height: 52,
		minHeight: 52,
		borderRadius: "12px",
		borderStyle: "none",
		textAlign: "left",
		textIndent: "12px"
	})
};
const Form = styled.form`
	width: 90%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
	margin-bottom: 30px;
`;
const PaymentMethods = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 12px;
`;
const Item = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;
const CheckboxItem = styled(Item)`
	display: flex-start;
	gap: 12px;
`;
const Divider = styled.div`
	height: 1px;
	width: 100%;
	color: #00000;
	background-color: ${props => props.theme.checkout.divider};
`;
const FormSection = styled.div`
	display: flex; 
	flex-direction: column;
	justify-content: start;
	align-items: center;
	gap: 6px;
`;
const CustomCheckbox = styled(Checkbox)`
	.ant-checkbox-checked .ant-checkbox-inner {
		background-color: #000000;
		border-color: #000000;
	}

	.ant-checkbox-wrapper:hover .ant-checkbox-inner,
	.ant-checkbox:hover .ant-checkbox-inner, 
	.ant-checkbox-input:focus + .ant-checkbox-inner {
		border-color: #000000;
	}
`;
const Label = styled(Typography).attrs({
	variant: "header", weight: "bold"
})`
	width: 100%;
`;
const CheckboxText = styled(Label)`
	margin-top: 0;
`;
const Price = styled(Typography).attrs({
	variant: "header", size: "large"
})`
	width: fit-content;
`;
export {
	PrimaryFlexGrow,
	SecondaryFlexGrow, 
	PrimaryFooterBackground,
	SecondaryFooterBackground, 
	InfoText, 
	HeaderText, 
	PaymentHeader, 
	AccountForm, 
	ErrorMessage, 
	PaymentMethod, 
	WideCreatableSelect, 
	selectStyle, 
	Form, 
	Item, 
	Label,
	CheckboxItem, 
	Divider, 
	FormSection, 
	CheckboxText, 
	CustomCheckbox,
	Price,
}