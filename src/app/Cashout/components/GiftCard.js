import React from 'react';
import Form from './Form';
import Link from './Link';

// core functions
import { useCashout } from '@core/context/Cashout';

export default function GiftCard() {
    const {
        stage,
        link,
        handleGiftcardConfirmation,
    } = useCashout();

    return (
        <Form id={`${stage}-form`} onSubmit={handleGiftcardConfirmation}>
            <Link href={link} target="_blank">
                "Claim your Giftcard"
            </Link>
        </Form>
    )
}
