// node modules
import React from "react";
import styled from 'styled-components';

// styled css components
const SeedPhraseCtn = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 12px auto;
`;
const Row = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
`;
const WordBox = styled.div`
    background-color: #F6F6F6;
    display: flex;
    justify-content: space-between;
    padding-left: 7px;
    padding-right: 7px;
    min-width: 80px;
    height: 42px;
    align-items: center;
    border-radius: 4px;
`;
const Count = styled.div`
    color: #B0B0B0;
`;
const Word = styled.div`
    color: #000000;
    font-family: Inter-Medium, Helvetica;
`;

const SeedPhrase = ({ 
    phrase 
}) => {
    const phraseArray = phrase.split(" ");

    return (
        <SeedPhraseCtn>
            <Row>
                <WordBox>
                    <Count>1</Count>
                    <Word>{phraseArray[0]}</Word>
                </WordBox>
                <WordBox>
                    <Count>2</Count>
                    <Word>{phraseArray[1]}</Word>
                </WordBox>
                <WordBox>
                    <Count>3</Count>
                    <Word>{phraseArray[2]}</Word>
                </WordBox>
            </Row>
            <Row>            
                <WordBox>
                    <Count>4</Count>
                    <Word>{phraseArray[3]}</Word>
                </WordBox>
                <WordBox>
                    <Count>5</Count>
                    <Word>{phraseArray[4]}</Word>
                </WordBox>
                <WordBox>
                    <Count>6</Count>
                    <Word>{phraseArray[5]}</Word>
                </WordBox>
            </Row>
            <Row>
                <WordBox>
                    <Count>7</Count>
                    <Word>{phraseArray[6]}</Word>
                </WordBox>
                <WordBox>
                    <Count>8</Count>
                    <Word>{phraseArray[7]}</Word>
                </WordBox>
                <WordBox>
                    <Count>9</Count>
                    <Word>{phraseArray[8]}</Word>
                </WordBox>
            </Row>
            <Row>                
                <WordBox>
                    <Count>10</Count>
                    <Word>{phraseArray[9]}</Word>
                </WordBox>
                <WordBox>
                    <Count>11</Count>
                    <Word>{phraseArray[10]}</Word>
                </WordBox>
                <WordBox>
                    <Count>12</Count>
                    <Word>{phraseArray[11]}</Word>
                </WordBox>
            </Row>
        </SeedPhraseCtn>
    );
};

export default SeedPhrase;