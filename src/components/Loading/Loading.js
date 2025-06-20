import React from 'react'
import { Backdrop, Message, ModalContent, Spinner } from './Loading.styles'

const Loading = ({ children }) => {

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