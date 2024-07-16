// node modules
import React from 'react';
import styled from 'styled-components';

// react components
import { ReturnButton } from '@components/Common/PrimaryButton';
import Footer from '@components/Common/Footer';

// css styled components
const AgreeCtn = styled.div`
    width: 100%;
    height: 100%;
    background-color: #EAEAEA;
`;
const AgreeHeader = styled.div`
    width: 88%;
    height: 50px;
    background-color: #EAEAEA;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`;
const Title = styled.div`
    font-family: "Sequel 100 Wide 95", Helvetica;
`;
const Navigation = styled.div`
    display: flex;
    flex-direction: row;
`;
const HorizontalDivider = styled.div`
    height: 1px;
    width: 100%;
    background-color: #000000;
`;

const Payout = ({
    returnTo
}) => {
    // handlers
    const handlePayout = async () => {
        console.log("handlePayout()");
    }

    // DOM variables
    const payoutButtonText = "Payout placeholder";

    return (
        <>
            <AgreeCtn>
                <AgreeHeader>
                    <Navigation>
                        <ReturnButton returnTo={returnTo}/>
                        <Title>Payout</Title>                        
                    </Navigation>                    
                </AgreeHeader>
                <HorizontalDivider />  

                <div>RUNA PAYOUT</div>
            </AgreeCtn>
            <Footer
                origin={"/payout"} 
                buttonText={payoutButtonText}
                buttonOnClick={handlePayout}
            />        
        </>
    )
}

export default Payout;