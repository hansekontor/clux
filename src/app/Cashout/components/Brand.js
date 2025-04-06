import React from 'react';
import Select from 'react-select';
import 'react-range-slider-input/dist/style.css';
import Form from './Form';

// core functions
import { useCashout } from '@core/context/Cashout';

export default function Brand() {
    const {
        stage,
        tilloSelection,
        brandData,
        handleBrandSubmit,
        handleBrandChange,
    } = useCashout();

    return (
        <Form id={`${stage}-form`}
            onSubmit={handleBrandSubmit}
        >
            <Select
                options={tilloSelection}
                onChange={handleBrandChange}
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
