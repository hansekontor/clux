// node modules
import React, { useState } from 'react';
import styled from 'styled-components';

// react components
import RandomNumbers from './RandomNumbers';


// assets
import BackgroundSvg from '@assets/select_background.svg';
import ChickenPng from '@assets/chicken_placeholder.png';
import ArrowLeftSvg from '@assets/select_arrow_left.svg';
import ArrowRightSvg from '@assets/select_arrow_right.svg';

// styled css components
const ChickenSelect = styled.div`
    top: 17%;
    width: 90%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;    
    position: absolute; 
    margin-top: 5%;
    height: 56%;
`;
const Background = styled.div`
    z-index: -4;
    position: relative;
    width: inherit;
`;
const Outline = styled.img`
    z-index: -4;
    position: relative;
    width: inherit;
    height: auto;
`;
const Chicken = styled.img`
    z-index: -3;
    top: 15px;
    left: 45px;
    position: absolute;
    width: 87%;
`;
const SelectorCtn = styled.div`
    display: inline;
    align-items: center;
    width: inherit;
    justify-content: center;
    width: 100%;
`;
const SelectButton = styled.div`
    height: 40px;
    width: 40px;
    border-radius: 50px;
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
`;
const SelectLeft = styled(SelectButton)`
    background-image: url(${ArrowLeftSvg});
`;
const SelectRight = styled(SelectButton)`
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
const Selector = styled(SelectorCtn)`
    position: absolute;
    top: 50%;
`;

const ChickenSelector = ({
    passRandomNumbers,
    ...props
}) => {

    const [selectionChanged, setSelectionChanged] = useState(0);
    const handleSelect = (direction) => {
        setSelectionChanged(selectionChanged + 1)
        console.log("handleSelecet(), selectionChanged", direction);

    }
    return (
        <>
            <ChickenSelect {...props}>
                <Background>
                    <Outline src={BackgroundSvg}/>
                    <Chicken src={ChickenPng}/>
                </Background>

                <RandomNumbers 
                    chickenSelection={selectionChanged}
                    passRandomNumbers={passRandomNumbers}
                />
                    <Selector>
                        <Connector>
                            <SelectLeft onClick={() => handleSelect('left')}/>
                            <SelectRight onClick={() => handleSelect('right')}/>
                        </Connector>  
                    </Selector>
                    


            </ChickenSelect>
        </>
    )
}

export default ChickenSelector;