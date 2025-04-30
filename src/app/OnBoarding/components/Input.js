import styled from 'styled-components';

const Input = styled.input`
    border-radius: 12px;
    background-color: #F6F6F6;
    color: #00000;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 90%;
    border: ${props => props.$error ? "1px solid red" : "none"};
	text-indent: 12px;
    margin-bottom: 24px;
`;

export default Input;