import React, { useState } from 'react';
import {
    StyledQuantity,
    StyledQuantityChange,
    StyledQuantityInputContainer,
    StyledQuantitySuggestion,
    StyledScaleOut
} from './Input.styles';

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
        <StyledQuantityInputContainer>
            <StyledQuantityChange
                type="button"
                value="-"
                data-field="quantity"
                onClick={() => handleQuantityChange("decrement")}
            />
            <StyledQuantity
                type="number"
                step={step}
                min={step}
                max={max}
                value={quantity}
                onChange={e => handleQuantityChange(e.target.value)}
                name="quantity"
            />
            <StyledQuantityChange
                type="button"
                value="+"
                data-field="quantity"
                onClick={() => handleQuantityChange("increment")}
            />
        </StyledQuantityInputContainer>
    )
}

export const QuantitySuggestions = ({
    passQuantity
}) => {

    const [quantityChosen, setQuantityChosen] = useState(false);

    const handleSuggestion = (quantity) => {
        passQuantity(quantity);
        setQuantityChosen(true);
    }

    return (
        <StyledScaleOut $animate={quantityChosen}>
            <StyledQuantitySuggestion onClick={() => handleSuggestion(3)}>3</StyledQuantitySuggestion>
            <StyledQuantitySuggestion onClick={() => handleSuggestion(5)}>5</StyledQuantitySuggestion>
            <StyledQuantitySuggestion onClick={() => handleSuggestion(10)}>10</StyledQuantitySuggestion>
            <StyledQuantitySuggestion onClick={() => handleSuggestion(20)}>20</StyledQuantitySuggestion>
        </StyledScaleOut>
    )
}