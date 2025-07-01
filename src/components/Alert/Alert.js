import React from 'react'
import { BaseAlert } from './Alert.styles'
import { ErrorIcon, InfoIcon, SuccessIcon } from "../Icons";

export default function Alert({ children, ...props }) {
    return (
        <BaseAlert {...props}>
            {props.type === "success" && <SuccessIcon />}
            {props.type === "error" && <ErrorIcon />}
            {props.type === "info" && <InfoIcon />}
            <div>
                {children}
            </div>
        </BaseAlert>
    )
}
