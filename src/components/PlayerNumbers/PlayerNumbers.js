import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// assets
import LeftArrowSvg from '@assets/svgs/arrow_left.svg'
import RightArrowSvg from '@assets/svgs/arrow_right.svg';
import WhiteRightArrowSvg from '@assets/svgs/arrow_right_white.svg';
import WhiteLeftArrowSvg from '@assets/svgs/arrow_left_white.svg';

// styled components
import {
    StyledArrowIcon,
    StyledContainer,
    StyledLeftCutOut,
    StyledLeftEnd,
    StyledNumber,
    StyledRightCutOut,
    StyledRightEnd,
    StyledVerticalDivider
} from './PlayerNumbers.styles';

// gets a random integer between min max (both border values inclusive)
const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    const randomInt = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);

    return randomInt;
}

const PlayerNumbers = ({
    passRandomNumbers,
    fixedRandomNumbers,
    background,
    ...props
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
            const newRandomNumber = getRandomInt(1, 127);
            newRandomNumbers.push(newRandomNumber);
        }
        console.log("RandomNumbers", newRandomNumbers);
        // set component state
        setRandomNumberArray(newRandomNumbers);

        // set parent state
        passRandomNumbers(newRandomNumbers);
    }

    return (
        <StyledContainer {...props}>
            {randomNumberArray.length === 4 &&
                <>
                    {!fixedRandomNumbers ? (
                        <StyledLeftEnd onClick={() => handleNewNumbers()}>
                            <StyledLeftCutOut $color={background} />
                            <StyledArrowIcon src={LeftArrowSvg} />
                        </StyledLeftEnd>
                    ) : (
                        <StyledLeftEnd>
                            <StyledLeftCutOut $color={background} />
                            <StyledArrowIcon src={WhiteLeftArrowSvg} />
                        </StyledLeftEnd>
                    )}
                    <StyledVerticalDivider />
                    <StyledNumber>{randomNumberArray[0]}</StyledNumber>
                    <StyledVerticalDivider />
                    <StyledNumber>{randomNumberArray[1]}</StyledNumber>
                    <StyledVerticalDivider />
                    <StyledNumber>{randomNumberArray[2]}</StyledNumber>
                    <StyledVerticalDivider />
                    <StyledNumber>{randomNumberArray[3]}</StyledNumber>
                    <StyledVerticalDivider />
                    {!fixedRandomNumbers ? (
                        <StyledRightEnd onClick={() => handleNewNumbers()}>
                            <StyledRightCutOut $color={background} />
                            <StyledArrowIcon src={RightArrowSvg} />
                        </StyledRightEnd>
                    ) : (
                        <StyledRightEnd>
                            <StyledRightCutOut $color={background} />
                            <StyledArrowIcon src={WhiteRightArrowSvg} />
                        </StyledRightEnd>
                    )}
                </>
            }
        </StyledContainer>
    );
}

PlayerNumbers.propTypes = {
    passRandomNumbers: PropTypes.func,
    fixedRandomNumbers: PropTypes.array,
    background: PropTypes.string
}

export default PlayerNumbers;