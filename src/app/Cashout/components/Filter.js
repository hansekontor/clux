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
        cashoutMethod,
        maxCashoutAmount,  
        tilloCountryOptions, 
        tilloCurrencyOptions,
        cashoutAmount, 
        giftcardAmount,
        setGiftcardAmount,
        filterTilloBrands,
        tilloStage,
    } = useCashout();

    const handleSubmitFilters = async (e) => {
        e.preventDefault();

        if (cashoutMethod === "tillo") {
            const country = e.target.country.value;
            const currency = e.target.currency.value;

            filterTilloBrands(country, currency);
        }
    }

    return (
        <Form id={`${tilloStage}-form`} onSubmit={handleSubmitFilters}>
            <Typography variant="header" size="large">How many Tokens?</Typography>
            <QuantityInput
                quantity={giftcardAmount}
                passQuantity={setGiftcardAmount}
                step={10}
                max={maxCashoutAmount}
            />
            <Select
                options={tilloCurrencyOptions}
                label="Currency"
                name="currency"
                required
            />
            <Select
                options={tilloCountryOptions}
                label="Country"
                name="country"
                required
            />
        </Form>
    )
}
