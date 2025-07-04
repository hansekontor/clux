import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// core components
import { useApp } from 'blocklotto-sdk';

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
    background,
    isFixed,
    overrideNumbers,
    ...props
}) => {
    const { playerNumbers, setPlayerNumbers } = useApp();

    useEffect(() => {
        if (!isFixed || playerNumbers.length === 0) {
            generateRandomNumbers();
        }
    }, [])

    const generateRandomNumbers = () => {
        if (isFixed || overrideNumbers) return;

        const newRandomNumbers = [];

        for (let i = 0; i < 4; i++) {
            const newRandomNumber = getRandomInt(1, 127);
            newRandomNumbers.push(newRandomNumber);
        }
        console.log("New Player Numbers:", newRandomNumbers);
        setPlayerNumbers(newRandomNumbers);
    }

    return (
        <StyledContainer {...props}>
            {playerNumbers.length === 4 &&
                <>
                    {isFixed || overrideNumbers ? (
                        <StyledLeftEnd>
                            <StyledLeftCutOut $color={background} />
                            <StyledArrowIcon src={WhiteLeftArrowSvg} />
                        </StyledLeftEnd>
                    ) : (
                        <StyledLeftEnd onClick={() => generateRandomNumbers()}>
                            <StyledLeftCutOut $color={background} />
                            <StyledArrowIcon src={LeftArrowSvg} />
                        </StyledLeftEnd>
                    )}
                    <>
                        <StyledVerticalDivider />
                        {(overrideNumbers || playerNumbers).map((number, index) => (
                            <React.Fragment key={index}>
                                <StyledNumber>{number}</StyledNumber>
                                <StyledVerticalDivider />
                            </React.Fragment>
                        ))}
                    </>
                    {isFixed || overrideNumbers ? (
                        <StyledRightEnd>
                            <StyledRightCutOut $color={background} />
                            <StyledArrowIcon src={WhiteRightArrowSvg} />
                        </StyledRightEnd>
                    ) : (
                        <StyledRightEnd onClick={() => generateRandomNumbers()}>
                            <StyledRightCutOut $color={background} />
                            <StyledArrowIcon src={RightArrowSvg} />
                        </StyledRightEnd>
                    )}
                </>
            }
        </StyledContainer>
    );
}

PlayerNumbers.propTypes = {
    overrideNumbers: PropTypes.array || PropTypes.arrayOf(PropTypes.number) || PropTypes.number || null,
    background: PropTypes.string,
    isFixed: PropTypes.bool
}

export default PlayerNumbers;