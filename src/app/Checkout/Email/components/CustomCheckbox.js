import styled from "styled-components";
import { Checkbox } from 'antd';

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

export default CustomCheckbox;