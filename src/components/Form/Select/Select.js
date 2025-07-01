import React, { useState, useRef, useEffect } from 'react'
import { Flex } from '@components/Common'
import Alert from '@components/Alert'
import Typography from '@components/Typography'
import { Dropdown, Option, SearchOverlay, SelectContainer, SelectedValue } from './Select.styles'

export function Select({
    children,
    label,
    helperText,
    error,
    name,
    onChange,
    value,
    searchable = false,
    ...props
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef(null)

    const handleOptionClick = (val) => {
        if (onChange) {
            onChange({ target: { name, value: val } })
        }
        setOpen(false)
        setSearch('')
    }

    const selectedLabel = React.Children.toArray(children).find(
        (child) => child.props.value === value
    )?.props?.children

    const filteredChildren = React.Children.toArray(children).filter((child) =>
        child.props.children.toLowerCase().includes(search.toLowerCase())
    )

    const handleDocumentClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            setOpen(false)
        }
    }

    useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleDocumentClick)
        } else {
            document.removeEventListener('mousedown', handleDocumentClick)
        }
        return () => document.removeEventListener('mousedown', handleDocumentClick)
    }, [open])

    return (
        <Flex direction="column" gap={1}>
            {label && <label htmlFor={name}>{label}</label>}

            {/* Hidden input for form support */}
            <input
                type="hidden"
                name={name}
                value={value ?? ''}
                required={props.required}
            />

            <SelectContainer ref={containerRef}>
                {searchable && open && (
                    <SearchOverlay
                        autoFocus
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        onClick={(e) => e.stopPropagation()}
                    />
                )}

                <SelectedValue
                    onClick={() => setOpen((prev) => !prev)}
                    error={error}
                    open={open}
                    {...props}
                >
                    {selectedLabel || 'Select an option'}
                </SelectedValue>

                {open && (
                    <Dropdown>
                        {filteredChildren.length > 0 ? (
                            filteredChildren.map((child) =>
                                React.cloneElement(child, {
                                    onClick: () => handleOptionClick(child.props.value),
                                })
                            )
                        ) : (
                            <Option disabled>No results found</Option>
                        )}
                    </Dropdown>
                )}
            </SelectContainer>

            {helperText && (
                <Typography variant="caption" style={{ opacity: 0.7 }}>
                    {helperText}
                </Typography>
            )}
            {error && <Alert type="error">{error}</Alert>}
        </Flex>
    )
}