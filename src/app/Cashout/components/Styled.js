import styled from 'styled-components';
import RangeSlider from 'react-range-slider-input';


// css styled components
import { Scrollable } from '@components/Container';
const FlexGrow = styled(Scrollable)`
    background-color: ${props => props.theme.app.background};
`;
const Form = styled.form`
    flex-grow: 1;
    width: 90%;
    margin-top: 18px;
    gap: 24px;
    display: flex;
    flex-direction: column;
`;
const Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
`;
const Link = styled.a`
    text-decoration: undelined;
    margin-top: 36px;
`;
const StyledRangeSlider = styled(RangeSlider)`
    .range-slider__thumb[data-lower] {
        width: 0;
    }
    .range-slider__range {
        border-radius: 6px;
    }
`;
const Button = styled.button`
    background-color: #44405B;
    border-radius: 100px;
    padding: 7px;
    color: ${props => props.theme.checkout.background};
    font-weight: 600;
    height: 25px;
    display: flex; 
    align-items: center;
    border-style: none;
    cursor: pointer;
`;
const Amount = styled.div``;

export {
    FlexGrow, 
    Form, 
    Row, 
    Link, 
    StyledRangeSlider, 
    Button,
    Amount
}