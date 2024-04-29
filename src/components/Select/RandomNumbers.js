import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const RandomNumbersCtn = styled.div`
    width: 240px;
    height: 41px;
    border-radius: 41px;
    background: #ededed;
    color: #000000;
    position: absolute;
    display: flex;
    align-items: flex-end;
    gap: 5px;
    top: 14%;
    padding: 0px 6px;
`;
const VerticalDivider = styled.div`
    width: 1px;
    height: 41px;
    background-color: #c6c6c6;
    margin: 0px;
    padding 0px;
`;
const Number = styled.div`
    width: 38px;
    height: 35px;
    text-align: center;    
    font-size: 26px;
    font-style: normal;
    font-weight: 400;
    margin: 6px 7px auto;
`;

const RandomNumbers = ({
    chickenSelection,
    passRandomNumbers
}) => {

    const [randomNumberArray, setRandomNumberArray] = useState([]);

    // helpers
    // gets a random integer between min max (both border values inclusive)
    const getRandomInt = (min, max) => {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);

        const randomInt = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);

        return randomInt;
    }

    useEffect(()=> {
        console.log("RandomNumbers useEffect get new random numbers")
        let newRandomNumbers = [];

        for (let i = 0; i < 4; i++) {
            const newRandomNumber = getRandomInt(1,127);
            newRandomNumbers.push(newRandomNumber);
        }

        setRandomNumberArray(newRandomNumbers);
        passRandomNumbers(newRandomNumbers);
    }, [chickenSelection]);

    return (
        <RandomNumbersCtn>
            {randomNumberArray.length === 4 &&
                <>
                    <Number>{randomNumberArray[0]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[1]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[2]}</Number>
                    <VerticalDivider />
                    <Number>{randomNumberArray[3]}</Number>            
                </>
            }
        </RandomNumbersCtn>
    );
}

RandomNumbers.defaultProps = {
    passRandomNumbers: (numbers) => console.log(numbers),
}

export default RandomNumbers;