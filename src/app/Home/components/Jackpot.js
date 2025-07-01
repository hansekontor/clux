import React from 'react';

// react components
import { Flex } from "@components/Common";
import Typography from '@components/Typography';

export default function Jackpot() {
    return (
        <Flex
            padding={2}
            paddingLeft={3}
            paddingRight={3}
            backgroundColor={"tertiary.main"}
            color={"tertiary.contrastText"}
            borderRadius="lg"
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            <Typography variant={"h4"} as={"div"}>
                Prize Pool
            </Typography>
            <Typography variant={"h4"} as={"div"} fontWeight={700}>
                $20,000
            </Typography>
        </Flex>
    )
}
