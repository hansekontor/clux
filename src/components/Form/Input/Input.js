import React from 'react'
import { BaseInput } from './Input.styles'
import { Flex } from '@components/Common'
import Alert from '@components/Alert'
import Typography from '@components/Typography'

export default function Input({ ...props }) {
    return (
        <Flex direction="column" gap={1}>
            {props.label && <label htmlFor={props.name}>{props.label}</label>}
            <BaseInput {...props} />
            {props.helperText && <Typography variant="caption" style={{ opacity: 0.7 }}>{props.helperText}</Typography>}
            {props.error && <Alert type="error">{props.error}</Alert>}
        </Flex>
    )
}
