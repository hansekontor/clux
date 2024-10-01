// node modules
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// react components
import { FooterCtn, SupportBar, Links, LightFooterBackground } from '@components/Common/Footer';
import PrimaryButton from '@components/Common/PrimaryButton';
import NavigationBar from '@components/Common/Navigation';
import Header from '@components/Common/Header';

// util
import { getTilloBrands, getTilloGiftcard } from '@utils/cashout';

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
    width: 86%;
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
const Select = styled.select`
    border-radius: 12px;
    background-color: #F6F6F6;
    color: #000000;
    font-family: "Inter-Semibold", Helvetica;
    font-size: 16px;
    font-weight: 500;
    height: 52px;
    cursor: pointer;
    width: 100%;
    margin-bottom: 18px;
`;
const Option = styled.option`
    height: 50px;
`;
const Link = styled.a`
    text-decoration: undelined;
    margin-top: 36px;
`;

const Cashout = ({
    passLoadingStatus
}) => {
    const [brands, setBrands] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(false);
    const [country, setCountry] = useState("US");
    const [currency, setCurrency] = useState("USD");
    const [value, setValue] = useState(false);
    const [link, setLink] = useState(false);

    const balance = 333;

    const history = useHistory();

    // DOM variables
    const cashoutButtonText = "Confirm Amount";
    const title = "Cashout";
    const previousPath = location.state?.returnTo || "/select";    
    
    // handlers
    const handleCashout = async (e) => {
        e.preventDefault();
        const giftcardLink = await getTilloGiftcard(selectedBrand, currency, value);
        setLink(giftcardLink);
    }
    const handleReturn = () => {
        history.push(previousPath);
    }
    const handleCountryChange = (e) => {
        const country = e.target.value;
        setCountry(country);
    } 
    const handleCurrencyChange = (e) => {
        const currency = e.target.value;
        setCurrency(currency);
    }
    const handleBrandChange = (e) => {
        const brand = e.target.value;
        setSelectedBrand(brand);
    }
    const handleValueChange = (e) => {
        const value = e.target.value;
        setValue(value);
    }

    // fetch sandbox brandlist
    useEffect(async () => {
        if (!brands) {
            // add parameters
            const brandsArray = await getTilloBrands();
            console.log("brands", brandsArray);
            setBrands(brandsArray);
            setSelectedBrand(brandsArray[0].slug);
        }
    }, [brands]);


    return (
        <FlexGrow>
            <Header />
            <NavigationBar 
                handleOnClick={handleReturn}
                title={title}                              
            />
            <Form id="cashout-form">
                <Row>
                    <Select onChange={handleCountryChange}>
                        <Option value="US">US</Option>
                    </Select>
                    <Select onChange={handleCurrencyChange}>
                        <Option value="USD">USD</Option>
                    </Select>                    
                </Row>

                {brands && (
                    <Row>
                        <Select defaultValue={brands[0].slug} onChange={handleBrandChange} >
                            {brands.map((brand, index) => {
                                return <Option value={brand.slug} key={index}>{brand.name}</Option>
                            })}
                        </Select> 
                    </Row>
                   
                )}

                <Row>
                    <Input 
                        placeholder={"Cashout Amount"}
                        name="amount"
                        type="number"
                        onChange={handleValueChange}
                    />      
                </Row>
      

                {link && 
                    <Row>
                        <Link href={link} target="_blank">
                            Claim your Giftcard now
                        </Link>                    
                    </Row>
                }
            </Form>

            <FooterCtn>
                <LightFooterBackground />
                <PrimaryButton type="submit" form="cashout-form" onClick={handleCashout}>{cashoutButtonText}</PrimaryButton>
            </FooterCtn>
        </FlexGrow>       
    )
}

export default Cashout;