import React, { useEffect, useState } from 'react';
import sleep from '@utils/sleep';

// core functions
import { playerWinningsTier } from 'blocklotto-sdk';

// assets
import WhiteRightArrowSvg from '@assets/svgs/arrow_right_white.svg';
import WhiteLeftArrowSvg from '@assets/svgs/arrow_left_white.svg';

// styled components
import {
    StyledArrowIcon,
    StyledContainer,
    StyledLeftCutOut,
    StyledLeftEnd,
    StyledMultiplier,
    StyledNumber,
    StyledRightCutOut,
    StyledRightEnd,
    StyledVerticalDivider
} from './PlayerNumbers.styles';

export default function ResultingNumbers({
    numberArray,
    active,
    background
}) {
    const [showFirstNumber, setShowFirstNumber] = useState(false);
    const [showSecondNumber, setShowSecondNumber] = useState(false);
    const [showThirdNumber, setShowThirdNumber] = useState(false);
    const [showFourthNumber, setShowFourthNumber] = useState(false);
    const [multiplier, setMultiplier] = useState(16);

    const indexMap = new Map();
    for (let i = 0; i < numberArray.length; i++) {
        indexMap.set(i, numberArray[i]);
    }

    const sortedNumberArray = Array.from(indexMap).sort((a, b) => a[1] - b[1]);

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
                <StyledMultiplier>x{multiplier}</StyledMultiplier>
            }
            <StyledContainer>
                <StyledLeftEnd>
                    <StyledLeftCutOut $color={background} />
                    <StyledArrowIcon src={WhiteLeftArrowSvg} />
                </StyledLeftEnd>
                <StyledVerticalDivider />
                <StyledNumber $blurred={!showFirstNumber}>{numberArray[0]}</StyledNumber>
                <StyledVerticalDivider />
                <StyledNumber $blurred={!showSecondNumber}>{numberArray[1]}</StyledNumber>
                <StyledVerticalDivider />
                <StyledNumber $blurred={!showThirdNumber}>{numberArray[2]}</StyledNumber>
                <StyledVerticalDivider />
                <StyledNumber $blurred={!showFourthNumber}>{numberArray[3]}</StyledNumber>
                <StyledVerticalDivider />
                <StyledRightEnd>
                    <StyledRightCutOut $color={background} />
                    <StyledArrowIcon src={WhiteRightArrowSvg} />
                </StyledRightEnd>
            </StyledContainer>
        </>
    )
}
