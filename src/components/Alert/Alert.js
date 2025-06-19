import React from 'react'
import { BaseAlert } from './Alert.styles'
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function Alert({ children, ...props }) {
    return (
        <BaseAlert {...props}>
            {props.type === "success" && <CheckCircleOutlined />}
            {props.type === "error" && <CloseCircleOutlined />}
            {props.type === "info" && <ExclamationCircleOutlined />}
            <div>
                {children}
            </div>
        </BaseAlert>
    )
}
