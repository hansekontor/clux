import React, { useRef, useState } from 'react';
import { BaseDrawer, DrawerBackground } from './Drawer.styles';
import { Container, Flex } from "@components/Common";

export default function Drawer({ open, handleClose, children }) {
    const startY = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const onPointerDown = (e) => {
        setIsDragging(true);
        startY.current = e.clientY;
    };

    const onPointerMove = (e) => {
        if (!isDragging || startY.current === null) return;

        const delta = e.clientY - startY.current;
        if (delta > 80) {
            setIsDragging(false);
            startY.current = null;
            handleClose?.(); // fire the close
        }
    };

    const onPointerUp = () => {
        setIsDragging(false);
        startY.current = null;
    };

    return (
        <Flex justifyContent={"center"} alignItems={"center"} width={"100%"} position={"fixed"} bottom={"0px"} zIndex={999}>
            <BaseDrawer open={open} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
                <Flex paddingTop={2} width={"100%"} paddingBottom={2} style={{overflowY: "auto"}}>
                    <Container>
                        <Flex width={"100%"} justifyContent={"center"} alignItems={"center"} marginBottom={2}>
                            <Flex
                                height={"5px"}
                                width={"50px"}
                                backgroundColor={"grey.300"}
                                borderRadius={"lg"}
                                style={{ cursor: "pointer", touchAction: "none" }}
                                onPointerDown={onPointerDown}
                                onClick={handleClose}
                            />
                        </Flex>
                        <Flex direction={"column"} gap={2}>
                            {children}
                        </Flex>
                    </Container>
                </Flex>
            </BaseDrawer>
            <DrawerBackground open={open} onClick={handleClose} />
        </Flex>
    );
}