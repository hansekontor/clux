// node modules
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// react components
import { SmallHeader } from '@components/Common/Header'; 
import { SupportButtons } from '@components/Common/PrimaryButton';

// styled css components
const TextCtn = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 80%;
`;
const ScrollableTextCtn = styled.div`
    overflow-y: auto;
    text-align: left;
`;
const Caption = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
`;
const Text = styled.p`
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 30px;
`;
const Underlined = styled.a`
    text-decoration: underline;
`;

const HowToPlay = ({
    previous = 'select'
}) => {
    const history = useHistory();
    const location = useLocation();

    // handlers 
    const handleBackToSelection = () => {
        history.push(location.state?.prev || "/waitingRoom");    
    }

    return (
        <>
            <SmallHeader />
            <TextCtn>
                <ScrollableTextCtn>
                    <Caption>About CLUX</Caption>
                    <Text>CLUX is the first-ever legal, global, digital, lottery that also runs autonomously on a Bitcoin blockchain (XEC network), with instant payouts approximately every 10 minutes. </Text>

                    <Caption>How To Play</Caption>
                    <Text>
                        <li>Click the arrows to choose your numbers then click 'Buy Ticket' when ready</li>
                        <li>Follow the steps to use your credit card and purchase a lottery ticket</li>
                        <li>Enter your email address to be notified when results are available or check back in approximately 10 minutes</li>
                        <li>Click 'Redeem' to redeem your lottery ticket and then click 'Fight' to watch the battle and see your payout results</li>                        
                    </Text>        

                    <Caption>How It Works?</Caption>      
                    <Text>In CLUX, the player first chooses their numbers and purchases a lottery ticket. By redeeming the ticket, the player's numbers and wallet address are included in the blockchain transaction. When the block carrying the transaction finalizes, this generates the opponent's numbers, based on a random blockhain calculation. The game then adds each of the player's numbers with each of the opponent's numbers. Each of these four results are then divided by 16 and the remainders (or modulo) are added together to determine the player's results. The paytable below outlines the potential results, returns, and odds for each outcome.</Text>
                
                    <Caption>CLUX Paytable</Caption>
                    <table>
                        <tr>
                            <th>RESULT</th>
                            <th>RETURN</th>
                            <th>ODDS</th>
                        </tr>
                        <tr>
                            <td>0</td>
                            <td>16x</td>
                            <td>1 in 100,000</td>
                        </tr>
                        <tr>
                            <td>1-4</td>
                            <td>8x</td>
                            <td>1 in 943</td>
                        </tr>                        
                        <tr>
                            <td>5-6</td>
                            <td>4x</td>
                            <td>1 in 469</td>
                        </tr>                        
                        <tr>
                            <td>7-15</td>
                            <td>2x</td>
                            <td>1 in 18</td>
                        </tr>                        
                        <tr>
                            <td>16-35</td>
                            <td>1x</td>
                            <td>1 in 2</td>
                        </tr>
                        <tr>
                            <td>36-60</td>
                            <td>0</td>
                            <td>1 in 4</td>
                        </tr>
                    </table>

                    <br/>
                    <br/>

                    <Caption>Frequently Asked Questions (FAQ)</Caption>
                    
                    <Caption>What Makes CLUX Special</Caption>
                    <Text>CLUX is run autonomously on the XEC blockchain, a hard fork of Bitcoin, for provably fair results and ultra-high security. There is no central party choosing numbers of affecting the 100% random outcome.</Text>

                    <Caption>What exactly do I purchase?</Caption>
                    <Text>You purchase a lottery ticket from a legally licensed state lottery using an authorization code which encrypts your lottrey ticket and wallet address on the blockchain.</Text>

                    <Caption>Who can play CLUX?</Caption>
                    <Text>Anyone can play CLUX except residents of the United States and residents of any country in which it is illegal to play lottery games.</Text>

                    <Caption>Customer Support</Caption>
                    <Text>Please email us at XX@XXXX.XXX</Text>
                    <Text>Learn more about the technology <Underlined>here</Underlined>.</Text>

                </ScrollableTextCtn>
            </TextCtn>

            <SupportButtons 
                returnToPath={previous}
                types={['return']}
            />
        </>
    )
}

export default HowToPlay;