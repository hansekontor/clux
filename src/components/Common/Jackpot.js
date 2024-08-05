// node modules
import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';
import CoinBagSvg from '@assets/coin_bag.svg';

// assets

// styled css components
const StyledCarousel = styled(Carousel)`
    > .slick-slider {
        background-color: #ffffff;
        box-sizing: border-box;
        display:flex;
        flex-direction: row;
    }
    > .slick-dots li button {
        width: 6px;
        height: 6px;
        border-radius: 100%;
    }
    > .slick-dots li.slick-active button {
        background: #DDD6eF;
    }

`;
const Slide = styled.div`
    border-radius: 24px;
    border-style: none;
    width: 88%;
    height: 10%;
    min-height: 70px;
`;
const Jackpot = styled.div`
    color: white;
    border-radius: 24px;
    border-style: none;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const Text = styled.div`
    padding-left: 30px;
    text-align: left;
    padding-top: 15px;
`;
const Amount = styled.div`
    font-family: 'Sequel 100 Wide 95';
    font-size: 28px;
`;
const CoinBagIcon = styled.img`
    z-index: 10;
    padding-right: 30px;
`;
const DailyJackpotSlide = styled(Slide)`
    background: linear-gradient(60deg in oklab, #3F29BE, 40%, #DC8013);
`;
const WeeklyJackpotSlide = styled(Slide)`
    background: linear-gradient(90deg in oklab, #8570f0, 40%, #3F29BE);
`;
const MonthlyJackpotSlide = styled(Slide)`
    background: linear-gradient(90deg in oklab, #F3BB57, 40%, #D75910);
`;

const JackpotCarousel = ({
}) => {

    return (
        <StyledCarousel effect="fade" autoplay>
            <DailyJackpotSlide>
                <Jackpot>
                    <Text>
                        Daily Jackpot
                        <Amount>$2,000</Amount>                    
                    </Text>
                    <CoinBagIcon src={CoinBagSvg}/>
                </Jackpot>
            </DailyJackpotSlide>
            <WeeklyJackpotSlide>
                <Jackpot>
                    <Text>
                        Weekly Jackpot
                        <Amount>$12,000</Amount>                        
                    </Text>
                    <CoinBagIcon src={CoinBagSvg}/>
                </Jackpot>
            </WeeklyJackpotSlide>
            <MonthlyJackpotSlide>
                <Jackpot>
                    <Text>
                        Monthly Jackpot
                        <Amount>$50,000</Amount>                    
                    </Text>
                    <CoinBagIcon src={CoinBagSvg}/>
                </Jackpot>
            </MonthlyJackpotSlide>
        </StyledCarousel>
    )
}

const PayoutAmountCtn = styled(DailyJackpotSlide)`
    height: 100px;
`;
export const PayoutAmount = ({
    amount
}) => {
    return (
        <PayoutAmountCtn>
            <Jackpot>
                <Text>
                    Your Payout 
                    <Amount>${amount}</Amount>
                </Text>
                <CoinBagIcon src={CoinBagSvg}/>
            </Jackpot>            
        </PayoutAmountCtn>
    )
}

export default JackpotCarousel;