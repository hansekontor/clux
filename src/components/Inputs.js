import React, { useState } from 'react';
import styled from 'styled-components';
import { textItem } from '@components/CssUtil.js';
import { ScaleOut } from '@components/CssAnimations';

export const Input = styled.input`
    ${textItem}
    background-color: ${props => props.theme.input.background};            
    text-color: ${props => props.theme.input.color};
    border: ${props => props.$error ? "1px solid red" : "none"};
`;

const QuantityInputCtn = styled.div`
	width: 100%;
	display: flex;
	background-color: ${props => props.theme.input.background};
	border-radius: 12px;
`;
const QuantityChange = styled.input`
	height: 52px;
	width: 52px;
	max-height: 52px;
	background-color: ${props => props.theme.input.background};
	border-radius: 12px;
	border-style: none; 
    cursor: pointer;
`;
const Quantity = styled.input`
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
export const QuantityInput = ({
    quantity,
    passQuantity,
    step, 
    max
}) => {

    const handleQuantityChange = (input) => {
		if (typeof input === "number") {
            if (input !== quantity)
    			passQuantity(input);
		} else if (input === "increment") {
			let newQuantity = Number(quantity) + step;
            if (newQuantity > max)
                newQuantity = max;
            passQuantity(newQuantity);
		} else if (quantity > step) {
			let newQuantity = Number(quantity) - step;
            if (newQuantity < step) 
                newQuantity = step;
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
                step={step}
                min={step}
                max={max}
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
    background-color: ${props => props.theme.input.background};
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