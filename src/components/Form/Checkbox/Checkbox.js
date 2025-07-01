import React from 'react'
import { CheckboxInput, Wrapper } from './Checkbox.styles';
import Typography from '@components/Typography';

export default function Checkbox({
    label,
    checked,
    onChange,
    name,
    required,
    disabled,
    ...props
}) {
    const checkboxId = `checkbox-${name}`;

    return (
        <Wrapper>
            <CheckboxInput
                id={checkboxId}
                name={name}
                defaultChecked={checked}
                required={required}
                disabled={disabled}
                {...props}
            />
            <Typography as="label" variant="body1" htmlFor={checkboxId} fontWeight={400}>{label}</Typography>
        </Wrapper>
    )
}