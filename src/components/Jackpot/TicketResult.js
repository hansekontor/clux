import React from 'react';
import CoinBagSvg from '@assets/svgs/coin_bag.svg';
import {
    StyledAmount,
    StyledCoinBagIcon,
    StyledJackpot,
    StyledJackpotText,
    StyledResultContainer
} from './Jackpot.styles';

export default function TicketResult({amount}) {
    return (
        <StyledResultContainer>
            <StyledJackpot>
                <StyledJackpotText>
                    {amount > 0 ? "Winner" : "Better luck next time"}
                    <StyledAmount>${amount}</StyledAmount>
                </StyledJackpotText>
                {amount > 0 && <StyledCoinBagIcon src={CoinBagSvg} />}
            </StyledJackpot>
        </StyledResultContainer>
    )
}
