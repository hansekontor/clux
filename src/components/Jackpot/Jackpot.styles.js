import styled from "styled-components";
import { Carousel } from 'antd';
import Typography from '@components/Typography';

export const StyledCarousel = styled(Carousel)`
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

export const StyledSlide = styled.div`
    border-radius: 24px;
    border-style: none;
    width: 90%;
    height: 10%;
    min-height: 70px;
`;

export const StyledJackpot = styled.div`
    color: white;
    border-radius: 24px;
    border-style: none;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const StyledJackpotText = styled(Typography)`
    padding-left: 30px;
`;

export const StyledAmount = styled.div`
    font-family: 'Sequel 100 Wide 95';
    font-size: 20px;
    padding-top: 4px;
`;

export const StyledCoinBagIcon = styled.img`
    z-index: 10;
    padding-right: 30px;
`;

export const StyledDailyJackpotSlide = styled(StyledSlide)`
    background: linear-gradient(60deg in oklab, #3F29BE, 40%, #DC8013);
`;

export const StyledWeeklyJackpotSlide = styled(StyledSlide)`
    background: linear-gradient(90deg in oklab, #8570f0, 40%, #3F29BE);
`;

export const StyledMonthlyJackpotSlide = styled(StyledSlide)`
    background: linear-gradient(90deg in oklab, #F3BB57, 40%, #D75910);
`;

export const StyledResultContainer = styled(StyledDailyJackpotSlide)`
    min-height: 95px;
    border-radius: 24px 24px 0px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;