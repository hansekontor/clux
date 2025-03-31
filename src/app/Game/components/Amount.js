// node modules
import React from 'react';
import styled from 'styled-components';

// assets
import CoinBagSvg from '@assets/svgs/coin_bag.svg';

// styled css components
const AmountCtn = styled.div`
    height: 98px;
    width: 75%;
    background: linear-gradient(60deg in oklab, #3F29BE, 40%, #DC8013);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
`;
const Text = styled.div`
    flex-direction: column;
    align-items: left;
`;
const Label = styled.div`    
    font-family: Inter-Medium;
    font-size: 14px;
    color: #D4D2E1;`;
const Amount = styled.div`
    font-family: Sequel 100 Wide 95;
    font-size: 28px;
    color: #FFFFFF;
`;
const Image = styled.img`
    z-index: 10;
`;

const ResultingAmount = ({amount}) => {
    return (
        <AmountCtn>
            <Text>
                <Label>Winner</Label>
                <Amount>${amount}</Amount>
            </Text>
            <Image src={CoinBagSvg}/>
        </AmountCtn>
    )
}

export default ResultingAmount;