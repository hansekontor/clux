import styled from "styled-components";
import CreatableSelect from 'react-select/creatable';

const WideCreatableSelect = styled(CreatableSelect)`
	width: 100%;
`;

export const selectStyle = {
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

export default WideCreatableSelect;