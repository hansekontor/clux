import React from 'react';
import styled from 'styled-components';
import ArrowLeftSvg from '@assets/select_arrow_left.svg';
import ArrowRightSvg from '@assets/select_arrow_right.svg';

const SelectorCtn = styled.div`
    display: inline;
    align-items: center;
    width: inherit;
    justify-content: center;
    width: 100%;
`;
const Select = styled.div`
    height: 40px;
    width: 40px;
    border-radius: 50px;
    background-color: #000000;
    color: #ffffff;
`;
const SelectLeft = styled(Select)`
    background-image: url(${ArrowLeftSvg});
`;
const SelectRight = styled(Select)`
    background-image: url(${ArrowRightSvg});
`;
const Connector = styled.div`
    height: 40px;
    width: 100%;
    border-radius: 50px;
    background-color: #5e5e5e15;
    display: flex;
    justify-content: space-between;
`;


const Selector = ({...props}) => {
    return (
        <SelectorCtn {...props}>
            <Connector>
                <SelectLeft />
                <SelectRight />  
            </Connector>
        </SelectorCtn>
    );
}


export default Selector;