import React from 'react';
import Typography from '@components/Typography';
import { QuantityInput } from '@components/Inputs';
import Select from 'react-select';
import 'react-range-slider-input/dist/style.css';
import Form from './Form';

// core functions
import { useCashout } from '@core/context/Cashout';

export default function Filter() {
    const {
        cashoutCountryOptions,
        cashoutCurrencyOptions,
        stage,
        cardAmount,
        maxAmount,
        handleSubmitFilters,
        setCardAmount,
    } = useCashout();

    return (
        <Form id={`${stage}-form`} onSubmit={handleSubmitFilters}>
            <Typography variant="header" size="large">How many Tokens?</Typography>
            <QuantityInput
                quantity={cardAmount}
                passQuantity={setCardAmount}
                step={10}
                max={maxAmount}
            />
            <Select
                options={cashoutCurrencyOptions}
                label="Currency"
                name="currency"
                required
            />
            <Select
                options={cashoutCountryOptions}
                label="Country"
                name="country"
                required
            />
        </Form>
    )
}
