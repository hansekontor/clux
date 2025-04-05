import React from 'react';
import { 
    StyledContainer, 
    StyledCount, 
    StyledRow, 
    StyledWord, 
    StyledWordBox 
} from './SeedPhrase.styles';

export default function SeedPhrase({
    phrase
}) {
    const phraseArray = phrase.split(" ");

    return (
        <StyledContainer>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
                <StyledRow key={rowIndex}>
                    {phraseArray.slice(rowIndex * 3, rowIndex * 3 + 3).map((word, i) => (
                        <StyledWordBox key={i}>
                            <StyledCount>{rowIndex * 3 + i + 1}</StyledCount>
                            <StyledWord>{word}</StyledWord>
                        </StyledWordBox>
                    ))}
                </StyledRow>
            ))}
        </StyledContainer>
    )
}
