import React, { useState } from 'react'

// core functions
import { useCheckout, checkoutCountryOptions } from "blocklotto-sdk";

// react components
import Button from '@components/Button';
import Typography from '@components/Typography';
import { Input, Select, SelectOption, Checkbox } from '@components/Form';
import { Flex, Divider } from '@components/Common';

export default function Email() {
    const {
        emailError,
        countryError,
        handleSubmitEmail,
    } = useCheckout();
    const [selectValue, setSelectValue] = useState('');
    const [age, setAge] = useState(false);
    const [id, setId] = useState(false);
    const [terms, setTerms] = useState(false);


    return (
        <Flex
            as={'form'}
            direction="column"
            gap={3}
            id='email-form'
            onSubmit={(e) => handleSubmitEmail(e)}
        >
            <Flex direction="column" gap={2}>
                <Typography variant="h5" as={'h2'}>Create Your Account</Typography>

                <Flex direction="column" gap={1}>
                    <Typography variant="body1">
                        Please enter your details to create an account.
                    </Typography>
                    <Input
                        placeholder="your@email.com"
                        name="email"
                        type="text"
                        error={emailError}
                        helperText={"Your email is required and is only used to announce results. No marketing emails."}
                        required
                    />
                </Flex>
                <Flex direction="column" gap={1}>
                    <Typography variant="body1">Select the country of your government-issued ID.</Typography>

                    <Select
                        name="country"
                        value={selectValue}
                        required
                        error={countryError}
                        onChange={(e) => setSelectValue(e.target.value)}
                        searchable
                    >
                        {checkoutCountryOptions.map((option) => (
                            <SelectOption key={option.value} value={option.value}>{option.label}</SelectOption>
                        ))}
                    </Select>
                </Flex>

                <Divider />

                <Flex direction="column" gap={1}>
                    <Flex direction="column" gap={1}>
                        <Checkbox
                            name="age"
                            label="I confirm that I am at least 18 years old"
                            checked={age}
                            onChange={(e) => setAge(e.target.checked)}
                            required
                        />
                        <Checkbox
                            name="id"
                            label="I understand a government ID will be required for purchase and I will be verified during KYC"
                            checked={id}
                            onChange={(e) => setId(e.target.checked)}
                            required
                        />
                        <Checkbox
                            name="terms"
                            label="I agree to the Purchase Terms, Privacy Policy and Terms of Service"
                            checked={terms}
                            onChange={(e) => setTerms(e.target.checked)}
                            required
                        />
                    </Flex>
                </Flex>


            </Flex>
            <Button
                form={"email-form"}
                size={"sm"}
                color={"tertiary"}
            >
                Continue
            </Button>
        </Flex>
    )
}
