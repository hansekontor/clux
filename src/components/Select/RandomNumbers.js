import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const RandomNumbersCtn = styled.div`
    width: fit-content;
    height: 40px;
    border-radius: 41px;
    background: #ededed;
    color: #000000;
    display: flex;
    align-items: flex-end;
    gap: 5px;
    padding: 0px 12px;
    gap: 10px;
`;
const Number = styled.div`
    text-align: center;    
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    font-family: "Sequel 100 Wide 95", Helvetica;
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
                    <Number>{randomNumberArray[1]}</Number>
                    <Number>{randomNumberArray[2]}</Number>
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