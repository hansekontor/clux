import React from 'react'
import { Option } from './Select.styles'

export function SelectOption({ children, onClick }) {
    return <Option onClick={onClick}>{children}</Option>
}