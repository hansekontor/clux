import React from 'react'

// core functions
import { useCheckout } from '@core/context/Checkout';
import checkoutCountryOptions from '@core/constants/checkoutCountryOptions';

// custom react components
import Header from '@components/Header';
import Navigation from '@components/Navigation';
import Footer from '@components/Footer';
import Typography from '@components/Typography';
import { Input } from '@components/Inputs';
import Button from '@components/Button';
import FlexGrow from '../components/FlexGrow';
import FooterBackground from '../components/FooterBackground';
import AccountForm from '../components/AccountForm';
import Item from '../components/Item';
import CheckboxItem from './components/CheckboxItem';
import CustomCheckbox from './components/CustomCheckbox';
import CheckboxText from './components/CheckboxText';
import WideCreatableSelect, { selectStyle } from './components/WideCreatableSelect';
import Label from './components/Label';
import FormSection from './components/FormSection';
import Divider from './components/Divider';
import ErrorMessage from '../components/ErrorMessage';

export default function Email() {
    const {
        emailError,
        countryError,
        handleSubmitEmail,
    } = useCheckout();

    const handleReturn = () => {
        const previousPath = "/select";
        history.push(previousPath);
    }

    return (
        <>
            <Header />
            <Navigation
                handleOnClick={handleReturn}
                title={"Create Account"}
            />
            <FlexGrow>
                <AccountForm id='email-form' onSubmit={(e) => handleSubmitEmail(e)}>

                    <FormSection>
                        <Item>
                            <Typography variant="header" size="large">Create Your Account</Typography>
                        </Item>
                        <Item>
                            <Typography variant="paragraph">
                                Please enter your details to create an account.
                            </Typography>
                        </Item>
                    </FormSection>

                    <FormSection>
                        <Label>Email</Label>
                        <Input
                            placeholder="your@email.com"
                            name="email"
                            type="text"
                            required
                        />
                        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                        <Item>
                            <Typography variant="paragraph">Your email is required and is only used to announce results. No marketing emails.</Typography>
                        </Item>
                    </FormSection>
                    <FormSection>
                        <Label>Country</Label>
                        <Item>
                            <Typography variant="paragraph">Select the country of your government-issued ID.</Typography>
                        </Item>
                        <WideCreatableSelect
                            isClearable
                            name="country"
                            required
                            options={checkoutCountryOptions}
                            placeholder={"Select your country"}
                            styles={selectStyle}
                        />
                        {countryError && <ErrorMessage>{countryError}</ErrorMessage>}
                    </FormSection>

                    <Divider />

                    <CheckboxItem>
                        <CustomCheckbox required />
                        <CheckboxText>I confirm that I am at least 18 years old</CheckboxText>
                    </CheckboxItem>
                    <CheckboxItem>
                        <CustomCheckbox required />
                        <CheckboxText>I understand a government ID will be required for purchase and I will be verified during KYC</CheckboxText>
                    </CheckboxItem>
                    <CheckboxItem>
                        <CustomCheckbox required />
                        <CheckboxText>I agree to the Purchase Terms, Privacy Policy and Terms of Service</CheckboxText>
                    </CheckboxItem>

                </AccountForm>
            </FlexGrow>
            <Footer variant="empty">
                <FooterBackground />
                <Button
                    form={"email-form"}
                >
                    Continue
                </Button>
            </Footer>
        </>
    )
}
