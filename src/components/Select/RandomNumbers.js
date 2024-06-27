import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const RandomNumbersCtn = styled.div`
    width: 88%;
    height: 56px;
    border-radius: 16px;
    background: #ffffff;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-bottom: 9px;
`;
const VerticalDivider = styled.div`
    width: 1px;
    height: 56px;
    border-left: 1px dashed;
    background-color: #c6c6c6;
`;
const Arrow = styled.div``;
const LeftArrow = styled(Arrow)`
    margin-left: 0px;
    width: 10%;
`;
const RightArrow = styled(Arrow)`
    margin-right: 0px;
    width: 10%;
`;
const Number = styled.div`
    text-align: center;    
    font-size: 24px;
    font-weight: 400;
    font-family: "Sequel 100 Wide 95", Helvetica;
    color: #000000;
    width: 20%;
`;

const RandomNumbers = ({
    passRandomNumbers
}) => {

    const [randomNumberArray, setRandomNumberArray] = useState([]);
    const [arrayHistory, setArrayHistory] = useState([]);

    // helpers
    // gets a random integer between min max (both border values inclusive)
    const getRandomInt = (min, max) => {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);

        const randomInt = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);

        return randomInt;
    }

    // hooks 
    useEffect(() => {
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
            <LeftArrow onClick={() => handleNewNumbers()}>L</LeftArrow>
            {randomNumberArray.length === 4 &&
                <>
                    <VerticalDivider />
                    <Number>{randomNumberArray[0]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[1]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[2]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[3]}</Number>            
                    <VerticalDivider />
                </>
            }                    
            <RightArrow onClick={() => handleNewNumbers()}>R</RightArrow>
        </RandomNumbersCtn>
    );
}

RandomNumbers.defaultProps = {
    passRandomNumbers: (numbers) => console.log(numbers),
}

export default RandomNumbers;