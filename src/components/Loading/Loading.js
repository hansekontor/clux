import React from 'react'
import { Backdrop, Message, ModalContent, Spinner } from './Loading.styles'

const Loading = ({ children }) => {
    console.log('Loading', children)
    console.log('Loading here')

    return (
        <Backdrop>
            <ModalContent>
                <Spinner />
                <Message>{children}</Message>
            </ModalContent>
        </Backdrop>
    )
}

export default Loading