// node modules
import React from 'react';
import { Modal } from 'antd';

// core functions
import { useCashout } from '@core/context/Cashout';

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
    const [modal, modalHolder] = Modal.useModal();
    const { stage, handleReturn } = useCashout();

    return (
        <>
            {modalHolder}
            <FlexGrow>
                <Header />
                <Navigation
                    handleOnClick={handleReturn}
                    title={"Cashout"}
                />
                {stage === "filter" && <Filter />}

                {stage === "brand" && <Brand />}

                {stage === "giftcard" && <GiftCard />}

                <Footer variant="empty">
                    <Button type="submit" form={`${stage}-form`}>
                        {stage === "filter" &&
                            <>Go to Brands</>
                        }
                        {stage === "brand" &&
                            <>Get Giftcard</>
                        }
                        {stage === "giftcard" &&
                            <>Back to Home</>
                        }
                    </Button>
                </Footer>
            </FlexGrow>
        </>
    )
}

export default Cashout;
