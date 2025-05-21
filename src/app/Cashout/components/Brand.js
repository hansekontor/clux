import React from 'react';
import Select from 'react-select';
import 'react-range-slider-input/dist/style.css';
import Form from './Form';

// core functions
import { useCashout, useNotifications } from 'blocklotto-sdk';

export default function Brand() {
    const { 
        tilloStage,
        setTilloStage,
        tilloSelection, 
        brandData, 
        handleTilloBrandChange,
        getGiftcardLink,
    } = useCashout();
    const notify = useNotifications()

    const handleBrandSubmit = async (e) => {
        e.preventDefault();

        const brand = e.target.brand.value;

        const link = await getGiftcardLink(brand, handleGiftcardError);

        if (link) {
            setTilloStage("giftcard");
        }
    }

    const handleGiftcardError = () => {
        notify({ type: "error", message: "Giftcard API Error"});
    }

    return (
        <Form id={`${tilloStage}-form`}
            onSubmit={handleBrandSubmit}
        >
            <Select
                options={tilloSelection}
                onChange={(item) => handleTilloBrandChange(item.brand)}
                name="brand"
            />

            {brandData && (
                <>
                    <img src={brandData.logo} />
                    <p>
                        {brandData.description}
                    </p>                
                </>
            )}
        </Form>
    )
}
