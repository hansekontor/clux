// node modules
import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';

// assets

// styled css components
const StyledCarousel = styled(Carousel)`
    > .slick-slider {
        width: 100px;
        background-color: #ffffff;
        box-sizing: border-box;
    }
    > .slick-dots li button {
        width: 6px;
        height: 6px;
        border-radius: 100%;
    }
    > .slick-dots li.slick-active button {
        background: red;
    }

`;
const Jackpot = styled.div`
    color: black;
    background-color: #red;
    border-radius: 24px;
    border-style: none;
    width: 88%;
    height: 100px;
`;
const DailyJackpot = styled(Jackpot)`
    background-color: #6c5eff;
    color: white;
`;
const WeeklyJackpot = styled(Jackpot)`
    background-color: #2512fc;
    color: white;
`;
const MonthlyJackpot = styled(Jackpot)`
    background-color: #f59542;
`;

const JackpotCarousel = ({
}) => {

    return (
        <StyledCarousel effect="fade" autoplay>
            <DailyJackpot>
                Daily Jackpot
            </DailyJackpot>
            <WeeklyJackpot>
                Weekly Jackpot
            </WeeklyJackpot>
            <MonthlyJackpot>
                Monthly Jackpot
            </MonthlyJackpot>
        </StyledCarousel>
    )
}

export default JackpotCarousel;