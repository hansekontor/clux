// node modules
import React from 'react';
import Select from 'react-select';
import 'react-range-slider-input/dist/style.css';
import { Modal } from 'antd';

// core functions
import { useCashout } from '@core/context/Cashout';

// react components
import Footer from '@components/Footer';
import Navigation from '@components/Navigation';
import Header from '@components/Header';
import { QuantityInput } from '@components/Inputs';
import Typography from '@components/Typography';
import * as S from './components/Styled';
import Button from '@components/Button';



const Cashout = () => {
    const [modal, modalHolder] = Modal.useModal();
    const {
        cashoutCountryOptions,
        cashoutCurrencyOptions,
        stage,
        cardAmount,
        maxAmount,
        tilloSelection,
        brandData,
        link,
        handleReturn,
        handleSubmitFilters,
        handleBrandSubmit,
        handleBrandChange,
        handleGiftcardConfirmation,
        setCardAmount,
    } = useCashout();

    return (
        <>
            {modalHolder}
            <S.FlexGrow>
                <Header />
                <Navigation
                    handleOnClick={handleReturn}
                    title={"Cashout"}
                />
                {stage === "filter" &&
                    <S.Form id={`${stage}-form`} onSubmit={handleSubmitFilters}>
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
                    </S.Form>
                }

                {stage === "brand" &&
                    <S.Form id={`${stage}-form`}
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


                    </S.Form>
                }

                {stage === "giftcard" &&
                    <S.Form id={`${stage}-form`} onSubmit={handleGiftcardConfirmation}>
                        <S.Link href={link} target="_blank">
                            "Claim your Giftcard"
                        </S.Link>
                    </S.Form>
                }

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
            </S.FlexGrow>
        </>
    )
}

export default Cashout;
