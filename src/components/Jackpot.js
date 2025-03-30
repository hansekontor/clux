// node modules
import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';
import CoinBagSvg from '@assets/svgs/coin_bag.svg';

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
    width: 90%;
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
    align-items: center;
`;
import { Text } from '@components/Text';
const JackpotText = styled(Text)`
    padding-left: 30px;
`;
const Amount = styled.div`
    font-family: 'Sequel 100 Wide 95';
    font-size: 20px;
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
                    <JackpotText>
                        Daily Jackpot
                        {/* <Amount>$2,000</Amount>                     */}
                        <Amount>Coming Soon</Amount>                    
                    </JackpotText>
                    <CoinBagIcon src={CoinBagSvg}/>
                </Jackpot>
            </DailyJackpotSlide>
            <WeeklyJackpotSlide>
                <Jackpot>
                    <JackpotText>
                        Weekly Jackpot
                        {/* <Amount>$12,000</Amount>                         */}
						<Amount>Coming Soon</Amount>
                    </JackpotText>
                    <CoinBagIcon src={CoinBagSvg}/>
                </Jackpot>
            </WeeklyJackpotSlide>
            <MonthlyJackpotSlide>
                <Jackpot>
                    <JackpotText>
                        Monthly Jackpot
                        {/* <Amount>$50,000</Amount>                     */}
						<Amount>Coming Soon</Amount>
                    </JackpotText>
                    <CoinBagIcon src={CoinBagSvg}/>
                </Jackpot>
            </MonthlyJackpotSlide>
        </StyledCarousel>
    )
}


const ResultCtn = styled(DailyJackpotSlide)`
    min-height: 95px;
    border-radius: 24px 24px 0px 0px;
`;

export const TicketResult = ({
    amount
}) => {
    
    return (
        <ResultCtn>
            <Jackpot>
                <JackpotText>
                    {amount > 0 ? "Winner" : "Loser"} 
                    <Amount>${amount}</Amount>
                </JackpotText>
                {amount > 0 && <CoinBagIcon src={CoinBagSvg}/> }
            </Jackpot>            
        </ResultCtn>
    )
}

export default JackpotCarousel;