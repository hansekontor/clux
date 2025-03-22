import React, { useState } from 'react';
import styled from 'styled-components';
import { textItem } from '@components/Common/CssUtil.js';
import { ScaleOut } from '@components/Common/CssAnimations';

export const Input = styled.input`
    ${textItem}
    background-color: #FEFFFE;            
    text-color: #ABCDEF;
    border: ${props => props.$error ? "1px solid red" : "none"};
`;

const QuantityInputCtn = styled.div`
	width: 100%;
	display: flex;
	background-color: #FEFFFE;
	border-radius: 12px;
`;
const QuantityChange = styled.input`
	height: 52px;
	width: 52px;
	max-height: 52px;
	background-color: #FEFFFE;
	border-radius: 12px;
	border-style: none; 
    cursor: pointer;
`;
const Quantity = styled.input`
    z-index: 1;
	flex-grow: 1;
	background-color: #FEFFFE;
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
export const QuantityInput = ({
    quantity,
    passQuantity,
}) => {

    const handleQuantityChange = (input) => {
		if (typeof input === "number") {
            if (input !== quantity)
    			passQuantity(input);
		} else if (input === "increment") {
			const newQuantity = Number(quantity) + 1;
			passQuantity(newQuantity);
		} else if (quantity > 1) {
			const newQuantity = Number(quantity) - 1;
			passQuantity(newQuantity);
		}
	}

    return (
        <QuantityInputCtn>
            <QuantityChange 
                type="button"
                value="-"
                data-field="quantity"
                onClick={() => handleQuantityChange("decrement")}
            />
            <Quantity 
                type="number"
                step={1}
                min={1}
                value={quantity}
                onChange={e => handleQuantityChange(e.target.value)}
                name="quantity"
            />
            <QuantityChange 
                type="button"
                value="+"
                data-field="quantity"
                onClick={() => handleQuantityChange("increment")}
            />
        </QuantityInputCtn>
    )
}

const QuantitySuggestion = styled.div`
    ${textItem}
    width: 20%;
    background-color: #FEFFFE;
    border-style: none;
    height: 100%;
    align-items: center;    
    justify-content: center;
    display: flex;
    text-indent: 0;
`;
const StyledScaleOut = styled(ScaleOut)`
    display: flex;
    height: ${props => props.$animate ? "0px" : "38px"};
    justify-content: space-between;
    transition: height 1s ease;
`;
export const QuantitySuggestions = ({
    passQuantity
}) =>  {

    const [quantityChosen, setQuantityChosen] = useState(false);

    const handleSuggestion = (quantity) => {
        passQuantity(quantity);
        setQuantityChosen(true);
    }
    return (
        <StyledScaleOut $animate={quantityChosen}>
            <QuantitySuggestion onClick={() => handleSuggestion(3)}>3</QuantitySuggestion>
            <QuantitySuggestion onClick={() => handleSuggestion(5)}>5</QuantitySuggestion>
            <QuantitySuggestion onClick={() => handleSuggestion(10)}>10</QuantitySuggestion>
            <QuantitySuggestion onClick={() => handleSuggestion(20)}>20</QuantitySuggestion>
        </StyledScaleOut>
    )
}