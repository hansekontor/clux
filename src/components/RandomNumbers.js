// node modules
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// util
import sleep from '@utils/sleep';

// assets
import LeftArrowSvg from '@assets/svgs/arrow_left.svg'
import RightArrowSvg from '@assets/svgs/arrow_right.svg';
import WhiteRightArrowSvg from '@assets/svgs/arrow_right_white.svg';
import WhiteLeftArrowSvg from '@assets/svgs/arrow_left_white.svg';


const RandomNumbersCtn = styled.div`
    width: 90%;
    height: 56px;
    border-radius: 0px 0px 16px 16px;
    background: ${props => props.theme.numbers.background};
    color: ${props => props.theme.text.color};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin-bottom: 12px;
`;
const VerticalDivider = styled.div`
    width: 1px;
    height: 56px;
    border-left: 1px dashed;
    background-color: ${props => props.theme.numbers.divider};
`;
const End = styled.div`
    width: 10%;
    object-fit: cover;
    position: relative;
`;
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
    font-family: '${props => props.theme.text.font}', Helvetica;
    color: ${props => props.$blurred ? "transparent" : "#000000"};
    width: 20%;
    text-shadow: ${props => props.$blurred ? "0 0 20px black" : "none"};
`;
const CutOut = styled.div`
    position: absolute;
    top: -26px;
    border-radius: 24px;
    background-color: ${props => props.$color ? props.color : '#48445c'};
    width: 24px;
    height: 24px;
`;
const LeftCutOut = styled(CutOut)`
    left: -12px;
`;
const RightCutOut = styled(CutOut)`
    right: -12px;
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
    fixedRandomNumbers,
    background
}) => {
	// todo: change var names
    const [randomNumberArray, setRandomNumberArray] = useState(fixedRandomNumbers ? fixedRandomNumbers : []);
    useEffect(() => {
        if (!fixedRandomNumbers)
            handleNewNumbers();
    }, [])

    const handleNewNumbers = () => {
        const newRandomNumbers = [];

        for (let i = 0; i < 4; i++) {
            const newRandomNumber = getRandomInt(1,127);
            newRandomNumbers.push(newRandomNumber);
        }
		console.log("RandomNumbers", newRandomNumbers);
		// set component state
        setRandomNumberArray(newRandomNumbers);
		
		// set parent state
        passRandomNumbers(newRandomNumbers);
    }

    return (
        <RandomNumbersCtn>        
            {randomNumberArray.length === 4 &&
                <>
                    {!fixedRandomNumbers ? (
                        <LeftEnd onClick={() => handleNewNumbers()}>
                            <LeftCutOut $color={background}/>
                            <ArrowIcon src={LeftArrowSvg} />
                        </LeftEnd>
                    ) : (
                        <LeftEnd>
                            <LeftCutOut $color={background}/>                            
                            <ArrowIcon src={WhiteLeftArrowSvg} />
                        </LeftEnd>
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
                            <RightCutOut $color={background}/>
                            <ArrowIcon src={RightArrowSvg} />
                        </RightEnd>
                    ) : (
                        <RightEnd>
                            <RightCutOut $color={background}/>
                            <ArrowIcon src={WhiteRightArrowSvg} />
                        </RightEnd>
                    )}
                </>
            }                    
        </RandomNumbersCtn>
    );
}

RandomNumbers.propTypes = {
	passRandomNumbers: PropTypes.func,
	fixedRandomNumbers: PropTypes.array,
	background: PropTypes.string 
}

const Multiplier = styled.div`
	background-color: yellow;
	height: 50px;
	width: 50px;
	border-radius: 30px;
	position: absolute;
	right: 0;
	z-index: 10;
	font-size: 20px;
	font-weight: 600;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const playerWinningsTier = [
	{ threshold: 0, multiplier: 16},
	{ threshold: 4, multiplier: 8},
	{ threshold: 6, multiplier: 4},
	{ threshold: 11, multiplier: 2},
	{ threshold: 35, multiplier: 1},
];

export const ResultingNumbers = ({
    numberArray, 
    active,
    background
}) => {
    const [showFirstNumber, setShowFirstNumber] = useState(false);
    const [showSecondNumber, setShowSecondNumber] = useState(false);
    const [showThirdNumber, setShowThirdNumber] = useState(false);
    const [showFourthNumber, setShowFourthNumber] = useState(false);
	const [multiplier, setMultiplier] = useState(16);

    
	const indexMap = new Map();
	for (let i = 0; i < numberArray.length; i++) {
		indexMap.set(i, numberArray[i]);
	}

    const sortedNumberArray = Array.from(indexMap).sort((a,b) => a[1] - b[1]);
	
    const revealNumber = (stage, sum) => {
		const index = sortedNumberArray[stage][0];
		const newMultiplier = playerWinningsTier.find(tier => tier.threshold >= sum)?.multiplier || 0;
		setMultiplier(newMultiplier);

        if (index === 0) {
            setShowFirstNumber(true);
        } else if (index === 1) {
            setShowSecondNumber(true);
        } else if (index === 2) {
            setShowThirdNumber(true);
        } else if (index === 3) {
            setShowFourthNumber(true);
        }
    }


	// hooks reveal one number every 700ms
    useEffect(async () => {
        if (active) {
			let stage = 0;
			let sum = 0;
			sum += sortedNumberArray[stage][1];
			revealNumber(stage, sum);
			stage = 1;
			await sleep(900);
			sum += sortedNumberArray[stage][1];
			revealNumber(stage, sum);
			stage = 2;
			await sleep(900);
			sum += sortedNumberArray[stage][1];
			revealNumber(stage, sum);    
			stage = 3;
			await sleep(900);
			sum += sortedNumberArray[stage][1];
			revealNumber(stage, sum);
        }
    }, [active])

      return (
		<>
			{active && 
				<Multiplier>x{multiplier}</Multiplier>
			}
			<RandomNumbersCtn>        
					<LeftEnd>
						<LeftCutOut $color={background}/>                            
						<ArrowIcon src={WhiteLeftArrowSvg} />
					</LeftEnd>
					<VerticalDivider />
					<Number $blurred={!showFirstNumber}>{numberArray[0]}</Number>
					<VerticalDivider />
					<Number $blurred={!showSecondNumber}>{numberArray[1]}</Number>
					<VerticalDivider />
					<Number $blurred={!showThirdNumber}>{numberArray[2]}</Number>
					<VerticalDivider />
					<Number $blurred={!showFourthNumber}>{numberArray[3]}</Number>            
					<VerticalDivider />            
					<RightEnd>
						<RightCutOut $color={background}/>
						<ArrowIcon src={WhiteRightArrowSvg} />
					</RightEnd>
			</RandomNumbersCtn>		
		</>
    )
}

export default RandomNumbers;