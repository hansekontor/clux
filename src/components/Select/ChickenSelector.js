// node modules
import React from 'react';
import styled from 'styled-components';

// react components

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
const HatSelector = styled(SelectorCtn)`
    position: absolute;
    top: 6%;
`;
const HeadSelector = styled(SelectorCtn)`
    top: 22%;
    position: absolute;
`;
const TorsoSelector = styled(SelectorCtn)`
    top: 50%;
    position: absolute;
`;
const LegSelector = styled(SelectorCtn)`
    top: 70%;
    position: absolute;
`;

const ChickenSelector = ({...props}) => {


    const handleSelect = (type, direction) => {
        console.log(type, direction)
    }
    return (
        <>
            <ChickenSelect {...props}>
                <Background>
                    <Outline src={BackgroundSvg}/>
                    <Chicken src={ChickenPng}/>
                </Background>

                <HatSelector>
                    <Connector>
                        <SelectLeft onClick={() => handleSelect('hat', 'left')}/>
                        <SelectRight onClick={() => handleSelect('hat', 'right')}/>
                    </Connector>                    
                </HatSelector>
                <HeadSelector>
                    <Connector>
                        <SelectLeft onClick={() => handleSelect('head', 'left')}/>
                        <SelectRight onClick={() => handleSelect('head', 'right')}/>
                    </Connector>                      
                </HeadSelector>
                <TorsoSelector>
                    <Connector>
                        <SelectLeft onClick={() => handleSelect('body', 'left')}/>
                        <SelectRight onClick={() => handleSelect('body', 'right')}/>
                    </Connector>                      
                </TorsoSelector>
                <LegSelector>
                    <Connector>
                        <SelectLeft onClick={() => handleSelect('legs', 'left')}/>
                        <SelectRight onClick={() => handleSelect('legs', 'right')}/>
                    </Connector>  
                </LegSelector>

            </ChickenSelect>
        </>
    )
}

export default ChickenSelector;