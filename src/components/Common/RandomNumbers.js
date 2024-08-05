import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import LeftArrowSvg from '@assets/arrow_left.svg'
import RightArrowSvg from '@assets/arrow_right.svg'

const RandomNumbersCtn = styled.div`
    width: 88%;
    height: 56px;
    border-radius: 16px;
    background: #fefffe;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-bottom: 9px;
    margin-bottom: 12px;
`;
const VerticalDivider = styled.div`
    width: 1px;
    height: 56px;
    border-left: 1px dashed;
    background-color: #c6c6c6;
`;
const End = styled.div`
    width: 10%;
    object-fit: cover;
`
const LeftEnd = styled(End)`
    margin-left: 0px;
    width: 10%;
`;
const RightEnd = styled(End)`
    margin-right: 0px;
    width: 10%;
`;
const ArrowIcon = styled.img`
    top: 2px;
    position: relative;
`;
const Number = styled.div`
    text-align: center;    
    font-size: 24px;
    font-weight: 400;
    font-family: "Sequel 100 Wide 95", Helvetica;
    color: ${props => props.blurred ? "transparent" : "#000000"};
    width: 20%;
    text-shadow: ${props => props.blurred ? "0 0 20px black" : "none"};
`;

// gets a random integer between min max (both border values inclusive)
const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    const randomInt = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);

    return randomInt;
}


const RandomNumbers = ({
    passRandomNumbers,
    fixedRandomNumbers
}) => {
    console.log("RandomNumbers()")

    const [randomNumberArray, setRandomNumberArray] = useState(fixedRandomNumbers ? fixedRandomNumbers : []);

    // hooks 
    useEffect(() => {
        if (!fixedRandomNumbers)
            handleNewNumbers();
    }, [])

    // handlers 
    const handleNewNumbers = () => {
        console.log("handleNewNumbers()");
        const newRandomNumbers = [];

        for (let i = 0; i < 4; i++) {
            const newRandomNumber = getRandomInt(1,127);
            newRandomNumbers.push(newRandomNumber);
        }
        
        setRandomNumberArray(newRandomNumbers);
        passRandomNumbers(newRandomNumbers);
    }

    return (
        <RandomNumbersCtn>        
            {randomNumberArray.length === 4 &&
                <>
                    {!fixedRandomNumbers ? (
                        <LeftEnd onClick={() => handleNewNumbers()}>
                            <ArrowIcon src={LeftArrowSvg} />
                        </LeftEnd>
                    ) : (
                        <LeftEnd />
                    )}
                    <VerticalDivider />
                    <Number>{randomNumberArray[0]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[1]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[2]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[3]}</Number>            
                    <VerticalDivider />            
                    {!fixedRandomNumbers ? (
                        <RightEnd onClick={() => handleNewNumbers()}>
                            <ArrowIcon src={RightArrowSvg} />
                        </RightEnd>
                    ) : (
                        <RightEnd />
                    )
            }
                </>
            }                    
        </RandomNumbersCtn>
    );
}

RandomNumbers.defaultProps = {
    passRandomNumbers: (numbers) => console.log(numbers),
}


export const ResultingNumbers = ({
    numberArray, 
    active
}) => {
    const [showFirstNumber, setShowFirstNumber] = useState(false);
    const [showSecondNumber, setShowSecondNumber] = useState(false);
    const [showThirdNumber, setShowThirdNumber] = useState(false);
    const [showFourthNumber, setShowFourthNumber] = useState(false);
    
    const sortedNumberArray = numberArray.slice().sort((a,b) => a - b);

    // helpers 
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const revealNumber = (targetIndex) => {
        if (targetIndex === 0) {
            setShowFirstNumber(true);
        } else if (targetIndex === 1) {
            setShowSecondNumber(true);
        } else if (targetIndex === 2) {
            setShowThirdNumber(true);
        } else if (targetIndex === 3) {
            setShowFourthNumber(true);
        }
    }

    const getIndexToReveal = (iteration) => {
        const equals = sortedNumberArray[iteration] === sortedNumberArray[iteration-1];
        let array = numberArray;
        if (equals) {
            const lastIndex = numberArray.indexOf(sortedNumberArray[iteration-1]);
            delete array[lastIndex];
        } 
        const index = array.indexOf(sortedNumberArray[iteration]);       
        return index;
    }

    useEffect(async () => {
        console.log("called useEffect 0")
        // debug for equal numbers
        if (active) {
            const index = numberArray.indexOf(sortedNumberArray[0]);
            console.log("index 0", index);
            revealNumber(index);
        }
    }, [active])

    useEffect(async () => {
        if (active) {
            const stage = 1;
            await sleep(700*stage);
            const index = getIndexToReveal(stage);
            console.log("index 1", index);
            revealNumber(index);
        }
    }, [active])

    useEffect(async () => {
        if (active) {
            const stage = 2;
            await sleep(700*stage);
            const index = getIndexToReveal(stage);
            console.log("index 2")
            revealNumber(index);
        }
    }, [active])

    useEffect(async () => {
        if (active) {
            const stage = 3;
            await sleep(700*stage);
            const index = getIndexToReveal(stage);
            console.log("index 3", index);
            revealNumber(index);
        }
    }, [active])

    
    return (
        <RandomNumbersCtn>        
                <LeftEnd />
                <VerticalDivider />
                <Number blurred={!showFirstNumber}>{numberArray[0]}</Number>
                <VerticalDivider />
                <Number blurred={!showSecondNumber}>{numberArray[1]}</Number>
                <VerticalDivider />
                <Number blurred={!showThirdNumber}>{numberArray[2]}</Number>
                <VerticalDivider />
                <Number blurred={!showFourthNumber}>{numberArray[3]}</Number>            
                <VerticalDivider />            
                <RightEnd />
        </RandomNumbersCtn>
    )
}


export default RandomNumbers;