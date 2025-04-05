import styled from "styled-components";
import { ScaleOut } from '@components/Animations';
import Typography from '@components/Typography';

export const StyledInput = styled.input`
    border-radius: 12px;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 100%;
    border-style: none;
    text-indent: 12px;
    background-color: ${props => props.theme.input.background};            
    text-color: ${props => props.theme.input.color};
    border: ${props => props.$error ? "1px solid red" : "none"};
`;

export const StyledQuantityInputContainer = styled.div`
	width: 100%;
	display: flex;
	background-color: ${props => props.theme.input.background};
	border-radius: 12px;
`;

export const StyledQuantityChange = styled.input`
	height: 52px;
	width: 52px;
	max-height: 52px;
	background-color: ${props => props.theme.input.background};
	border-radius: 12px;
	border-style: none; 
    cursor: pointer;
`;

export const StyledQuantity = styled.input`
    z-index: 1;
	flex-grow: 1;
	background-color: ${props => props.theme.input.background};
	border-style: none;
	text-align: center;
    cursor: default;

   	::-webkit-inner-spin-button{
        -webkit-appearance: none; 
        margin: 0; 
    }
    ::-webkit-outer-spin-button{
        -webkit-appearance: none; 
        margin: 0; 
    } 
  	::-moz-appearance: textfield;
`;

export const StyledQuantitySuggestion = styled(Typography).attrs({
	variant: "textItem"
})`
    width: 20%;
    background-color: ${props => props.theme.input.background};
    border-style: none;
    height: 100%;
    align-items: center;    
    justify-content: center;
    display: flex;
    text-indent: 0;
`;

export const StyledScaleOut = styled(ScaleOut)`
    display: flex;
    height: ${props => props.$animate ? "0px" : "38px"};
    justify-content: space-between;
    transition: height 1s ease;
`;