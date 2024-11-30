// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Select from 'react-select';

// react components
import { FooterCtn } from '@components/Common/Footer';
import PrimaryButton from '@components/Common/PrimaryButton';
import NavigationBar from '@components/Common/Navigation';
import Header from '@components/Common/Header';

// util
import { getTilloOptions, getTilloBrands, getTilloGiftcard } from '@utils/cashout';

// css styled components
const Input = styled.input`
    border-radius: 12px;
    background-color: #F6F6F6;
    color: #00000;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 100%;
    border: ${props => props.error ? "1px solid red" : "none"};
	text-indent: 12px;
`;
const FlexGrow = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FEFFFE;
    flex-direction: column;
    width: 100%;
`;
const Form = styled.form`
    flex-grow: 1;
    width: 90%;
    margin-top: 18px;
`;
const Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
`;
const Link = styled.a`
    text-decoration: undelined;
    margin-top: 36px;
`;


const Cashout = ({
    passLoadingStatus
}) => {
    const [stage, setStage] = useState("amount");
    const [amount, setAmount] = useState(false);
    const [currency, setCurrency] = useState(false);
    const [country, setCountry] = useState(false);
    const [tilloOptions, setTilloOptions] = useState(false);
    const [brandArray, setBrandArray] = useState(false);
    const [brandData, setBrandData] = useState(false);
    const [link, setLink] = useState(false);

    // content for react-select options
    const [currencyOptions, setCurrencyOptions] = useState(false);
    const [countryOptions, setCountryOptions] = useState(false);
    const [brandOptions, setBrandOptions] = useState(false);

    // dev todo: replace with sandbox token balance
    const balance = 333;

    const history = useHistory();

    // DOM variables
    const title = "Cashout";
    const previousPath = location.state?.returnTo || "/select";    
    


    // fetch country list
    useEffect(async () => {
        if (!tilloOptions) {
            const fetchedTilloOptions = await getTilloOptions();
            const fetchedCurrencyOptions = fetchedTilloOptions.map(option => {
                return {
                    label: option.currency,
                    value: option.currency
                }
            });

            setTilloOptions(fetchedTilloOptions);
            setCurrencyOptions(fetchedCurrencyOptions);
        }
    }, [tilloOptions]);

    // handlers
    const handleReturn = () => {
        history.push(previousPath);
    }    
    const handleAmountSubmit = (e) => {
        e.preventDefault();
        const inputAmount = e.target.amount.value;
        // todo: later add cashout provider conditional here

        setAmount(inputAmount);
        setStage("currency");
    }
    const handleCurrencyChange = (e) => {
        const selectedCurrency = e.value;
        console.log("selectedCurrency", selectedCurrency);
        const countryOptionsForCurrency = tilloOptions.find(item => item.currency === selectedCurrency)
            .countries
            .map(country => {
                // dev later add country names for labels
                return {
                    label: country,
                    value: country
                }
            });

        setCountryOptions(countryOptionsForCurrency);
        setCurrency(selectedCurrency);
        setStage("country");
    }
    const handleCountryChange = async (e) => {
        const selectedCountry = e.value;
        const fetchedBrands = await getTilloBrands(selectedCountry, currency, amount);
        const fetchedBrandOptions = fetchedBrands.map(brand => {
            return {
                value: brand.slug,
                label: brand.name
            }
        });

        setBrandArray(fetchedBrands);
        setBrandOptions(fetchedBrandOptions)
        setCountry(selectedCountry);
        setStage("brand");
    }
    const handleBrandChange = (e) => {
        const selectedBrand = e.value;
        const selectedBrandData = brandArray.find(item => item.slug === selectedBrand);

        setBrandData(selectedBrandData);
    }
    const handleBrandSubmit = async (e) => {
        e.preventDefault();
        const giftcardLink = await getTilloGiftcard(brandData.slug, currency, amount);

        setLink(giftcardLink);
    }


    return (
        <FlexGrow>
            <Header />
            <NavigationBar 
                handleOnClick={handleReturn}
                title={title}                              
            />

                {stage === "amount" && (
                    <>
                        <Form id="amount-form" onSubmit={handleAmountSubmit}>
                            <Input
                                name="amount"
                                required
                                placeholder={"Cashout Amount"}
                                type="number"
                            />                            
                        </Form>
        
                        <FooterCtn>
                            <PrimaryButton type="submit" form="amount-form">
                                Confirm Amount
                            </PrimaryButton>
                        </FooterCtn>                      
                    </>
                )}         

                {stage === "currency" && (
                    <>
                        <div>Cashout Amount: {amount}</div>
                        <Form id="currency-form">
                            <Select 
                                options={currencyOptions} 
                                onChange={handleCurrencyChange}
                                label="Currency"
                            />
                        </Form>
                        <FooterCtn>
                            <PrimaryButton>
                                Choose a Currency
                            </PrimaryButton>
                        </FooterCtn>
                    </>
                )} 

                {stage === "country" && (
                    <>
                        <div>Cashout Amount: {amount}</div>
                        <div>Cashout Currency: {currency}</div>
                        <Form id="country-form">
                            <Select 
                                options={countryOptions} 
                                onChange={handleCountryChange}    
                            />
                        </Form>
                        <FooterCtn>
                            <PrimaryButton>
                                Choose a Country
                            </PrimaryButton>
                        </FooterCtn>
                    </>
                )}

                {stage === "brand" && (
                    <>
                        <div>Cashout Amount: {amount}</div>
                        <div>Currency: {currency}</div>
                        <div>Country: {country}</div>
                        <Form id="brand-form" onSubmit={handleBrandSubmit}>
                            <Select 
                                options={brandOptions}
                                onChange={handleBrandChange}
                            />                        
                        
                            {brandData && (
                                <div>
                                    {brandData.description}
                                </div>
                            )}

                            {link && ( 
                                <Link href={link} target="_blank">
                                    "Claim your Giftcard"
                                </Link>
                            )}
                        </Form>

                        <FooterCtn>
                            <PrimaryButton type="submit" form="brand-form">
                                Confirm your Brand
                            </PrimaryButton>
                        </FooterCtn>
                    </>
                )}

        </FlexGrow>       
    )
}

export default Cashout;
