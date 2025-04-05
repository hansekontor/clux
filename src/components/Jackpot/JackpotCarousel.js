import React from 'react';
import CoinBagSvg from '@assets/svgs/coin_bag.svg';
import {
    StyledAmount,
    StyledCarousel,
    StyledCoinBagIcon,
    StyledDailyJackpotSlide,
    StyledJackpot,
    StyledJackpotText,
    StyledMonthlyJackpotSlide,
    StyledWeeklyJackpotSlide
} from './Jackpot.styles';

const JackpotCarousel = () => {
    return (
        <StyledCarousel effect="fade" autoplay>
            <StyledDailyJackpotSlide>
                <StyledJackpot>
                    <StyledJackpotText>
                        Daily Jackpot
                        {/* <StyledAmount>$2,000</StyledAmount>                     */}
                        <StyledAmount>Coming Soon</StyledAmount>
                    </StyledJackpotText>
                    <StyledCoinBagIcon src={CoinBagSvg} />
                </StyledJackpot>
            </StyledDailyJackpotSlide>
            <StyledWeeklyJackpotSlide>
                <StyledJackpot>
                    <StyledJackpotText>
                        Weekly Jackpot
                        {/* <StyledAmount>$12,000</StyledAmount>                         */}
                        <StyledAmount>Coming Soon</StyledAmount>
                    </StyledJackpotText>
                    <StyledCoinBagIcon src={CoinBagSvg} />
                </StyledJackpot>
            </StyledWeeklyJackpotSlide>
            <StyledMonthlyJackpotSlide>
                <StyledJackpot>
                    <StyledJackpotText>
                        Monthly Jackpot
                        {/* <StyledAmount>$50,000</StyledAmount>                     */}
                        <StyledAmount>Coming Soon</StyledAmount>
                    </StyledJackpotText>
                    <StyledCoinBagIcon src={CoinBagSvg} />
                </StyledJackpot>
            </StyledMonthlyJackpotSlide>
        </StyledCarousel>
    )
}

export default JackpotCarousel;