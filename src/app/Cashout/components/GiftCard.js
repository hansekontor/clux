import React from 'react';
import Form from './Form';
import Link from './Link';

// core functions
import { useCashout } from '@core/context/Cashout';

export default function GiftCard() {
    const {
        giftcardLink,
        tilloStage,
    } = useCashout();

    console.log("Cashout link", giftcardLink);

    const handleGiftcardConfirmation = (e) => {
        if (e)
            e.preventDefault();
        // add modal asking for confirmation
        const modalConfig = {
            title: "Confirm",
            content: "Have you claimed your giftcard?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => handleBackToHome(),
        };
        modal.confirm(modalConfig);
    }

    return (
        <Form id={`${tilloStage}-form`} onSubmit={handleGiftcardConfirmation}>
            <Link href={giftcardLink} target="_blank">
                "Claim your Giftcard"
            </Link>
        </Form>
    )
}
