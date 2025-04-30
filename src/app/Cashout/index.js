// node modules
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';

// core functions
import { useCashout } from 'blocklotto-sdk';
import { useNotifications } from 'blocklotto-sdk';

// react components
import Footer from '@components/Footer';
import Navigation from '@components/Navigation';
import Header from '@components/Header';
import Button from '@components/Button';
import Filter from './components/Filter';
import Brand from './components/Brand';
import GiftCard from './components/GiftCard';
import FlexGrow from './components/FlexGrow';


const Cashout = () => {
    const history = useHistory();
    const notify = useNotifications();
    const { 
        checkBalance, 
        tilloStage, 
        giftcardLink, 
        setGiftcardLink 
    } = useCashout();
    const [modal, modalHolder] = Modal.useModal();

    useEffect(() => {
        const isSufficientBalance = checkBalance();
        if (!isSufficientBalance) {
            notify({type: "error", message: "Insufficient Token Balance"});
            history.push("/select");
        };
    }, [])

    // handlers
    const handleReturn = () => {
        if (giftcardLink)
            return handleGiftcardConfirmation()
        else
            history.push("/select");
    }

    const handleBackToHome = () => {
        setGiftcardLink(false);
        return history.push("/select");
    }

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
        <>
            {modalHolder}
            <FlexGrow>
                <Header />
                <Navigation
                    handleOnClick={handleReturn}
                    title={"Cashout"}
                />
                {tilloStage === "filter" && 
                    <Filter />}

                {tilloStage === "brand" && <Brand />}

                {tilloStage === "giftcard" && <GiftCard />}

                <Footer variant="empty">
                    <Button type="submit" form={`${tilloStage}-form`}>
                        {tilloStage === "filter" &&
                            <>Go to Brands</>
                        }
                        {tilloStage === "brand" &&
                            <>Get Giftcard</>
                        }
                        {tilloStage === "giftcard" &&
                            <>Back to Home</>
                        }
                    </Button>
                </Footer>
            </FlexGrow>
        </>
    )
}

export default Cashout;
