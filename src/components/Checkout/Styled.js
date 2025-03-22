import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { Checkbox } from 'antd';

import { BoldHeader, LargeHeading } from '@components/Common/Text';
import { Scrollable, Background } from '@components/Common/Container';
import { textItem } from '@components/Common/CssUtil';

const PrimaryFlexGrow = styled(Scrollable)`
    background-color: #EAEAEA;
`;
const SecondaryFlexGrow = styled(Scrollable)`
	background-color: #FEFFFE;
`;

const PrimaryFooterBackground = styled(Background)`
    background-color: #EAEAEA;
`;
const SecondaryFooterBackground = styled(Background)`
	background-color: #FEFFFE;
`;
const InfoText = styled.p`
    width: 90%;
    font-size: 15px;
    line-height: 150%;
    color: #1A1826;
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
const ErrorMessage = styled.div`
	${textItem}
	background-color: #FB918E;
	color: #002152;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const PaymentMethod = styled(ErrorMessage)`
	${textItem}
	background-color: ${props => props.$active ? '#131312' : '#EAEAEA'};
	color: ${props => props.$active ? '#FEFFFE' : '#131312'};
	border-width: 1px;
	border-style: solid;
	border-color: #B9B9B9;
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
	background-color: #E1E0E0;
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
const Label = styled(BoldHeader)`
	width: 100%;
`;
const CheckboxText = styled(Label)`
	margin-top: 0;
`;
const Price = styled(LargeHeading)`
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