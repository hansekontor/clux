import React from 'react';
import Select from 'react-select';
import 'react-range-slider-input/dist/style.css';
import Form from './Form';

// core functions
import { useCashout } from '@core/context/Cashout';

export default function Brand() {
    const { 
        tilloStage,
        setTilloStage,
        tilloSelection, 
        brandData, 
        handleTilloBrandChange,
        getGiftcardLink,
    } = useCashout();

    const handleBrandSubmit = async (e) => {
        e.preventDefault();

        const brand = e.target.brand.value;

        const link = await getGiftcardLink(brand);

        if (link) {
            setTilloStage("giftcard");
        }
    }

    return (
        <Form id={`${tilloStage}-form`}
            onSubmit={handleBrandSubmit}
        >
            <Select
                options={tilloSelection}
                onChange={handleTilloBrandChange}
                name="brand"
            />

            {brandData && (
                <p>
                    {brandData.description}
                </p>
            )}
        </Form>
    )
}
