// node modules
import React, { useState, useContext, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { CopyOutlined } from '@ant-design/icons';

// react components 
import { successNotification, errorNotification } from '@components/Common/Notifications';
import SeedPhrase from '@components/Common/SeedPhrase';
import TicketHistory from './TicketHistory';
import Header from '@components/Common/Header'; 
import NavigationBar from '@components/Common/Navigation';
import FadeInOut from '@components/Backup/FadeInOut';
import { FooterCtn, SupportBar } from '@components/Common/Footer';
import { BillIcon, TicketIcon, ContactIcon, KeyIcon, LightWalletIcon, EnvelopeIcon } from '@components/Common/CustomIcons';
import { SecondaryButton } from '@components/Common/PrimaryButton';
import Email from '@components/Wallet/Email';
import ImportWallet from '@components/Wallet/ImportWallet';

import useWallet from '@hooks/useWallet';

// util
import { WalletContext } from '@utils/context';
import { isValidStoredWallet } from '@utils/cashMethods';
import { getWalletState } from '@utils/cashMethods';

// assets 
import RightArrowSvg from '@assets/arrow_right.svg';
import PencilIconSvg from '@assets/pencil_icon.svg';
import CopyboardSvg from '@assets/copyboard.svg';

// styled css components
const StyledFadeInOut = styled(FadeInOut)`
    width: 100%;
    height: 100%;
    background-color: #fefffe;
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const WalletCtn = styled.div`
    overflow-y: auto;
    width: 90%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    padding-top: 10px;
`;
export const Item = styled.div`
    border-radius: 7px;
    background-color: #f6f6f6;
    width: 100%;
    min-height: 60px;
    display: flex;
    justify-content: space-between; 
    align-items: center;
    cursor: pointer;
`;
const Circle = styled.div`
    position: relative;
    background-color: #D0CED8;
    border-radius: 20px;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const LabelCtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-left: 12px;
`;
const Value = styled.div`
    font-size: 12px;
    color: #98999c;
    flex-grow: 1;
    text-align: right;
    padding-right: 10px;
`;
export const Label = styled.div`
    font-weight: 600;
    line-height: 30px;
`;
// dev change color
const SmallItem = styled.div`
    width: 100%;
    font-weight: 600;
    border-bottom: 1px solid #EAEAEA;
    display: flex;
    justify-content: space-between;
    height: 38px;
    align-items: center;
    cursor: pointer;
`;
const Button = styled.img`
    padding-right: 10px;
`;
const StyledCopyOutlined = styled(CopyOutlined)`
    padding-right: 10px;
`;
const StyledSupportBar = styled(SupportBar)`
    padding: 0px;;
`;
const CopyboardIcon = styled.img`
    position: relative;
    top: 3px;
    margin-right: 5px;
`;
const SeedPhraseCtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const Wallet = ({    
    passLoadingStatus,
}) => {
    const history = useHistory();
    const location = useLocation();
    const ContextValue = useContext(WalletContext);
    const { wallet, loading } = ContextValue;
    const walletState = getWalletState(wallet);
    const { tickets } = walletState;
    const [selection, setSelection] = useState(false);
	// console.log("Wallet.js walletState", walletState);
	// console.log("Wallet.js tickets", tickets);
    const unredeemedIndicator = tickets.filter(ticket => !ticket.redeemTx).length;

	const { forceWalletUpdate } = useWallet();
	
	// console.log("tickets from wallet state", tickets);

	useEffect(() => {
		passLoadingStatus(false);
	}, [])

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    } 

    // handlers
    const handleReturn = () => {
        if (selection)
            setSelection(false);
        else 
            history.push(previousPath);
    }
    const handleToCashout = () => {
        history.push("/cashout");
    }
    const handleToTickets = () => {
        setSelection("Tickets");        
    }
    const handleCopyAddress = (address) => {
        navigator.clipboard.writeText(address);
        successNotification("Copied to Clipboard!");
    }
    const handleShowPhrase = () => {
        setSelection("Seed Phrase");
    };
    const handleChangeEmail = () => {
        setSelection("Email");
    }
    const handleImportWallet = () => {
        setSelection("Import Wallet");
    }
    const handleToTos = () => {
        console.log("to terms of service")
    }
    const handleToPrivacyPolicy = () => {
        console.log("to privacy policy");
    }
    const handleToRegulation = () => {
        console.log("to regulation");
    }
    const handleToResponsibleGaming = () => {
        console.log("to responsible gaming");
    }

    const handleCopySeedPhrase = () => {
        navigator.clipboard.writeText(wallet.mnemonic);
		successNotification("Copied to Clipboard!");
    }


    const title = "Wallet, Settings and Legal";
    const previousPath = location.state?.returnTo || "/select";

    return (
        <>
            <StyledFadeInOut duration={300} show={true}>
                <Header />
                <NavigationBar 
                    handleOnClick={handleReturn}
                    title={selection ? selection : title}
                    light={true}
                />

                {!loading && (
                    <WalletCtn>
                        {!selection && (
                            <>
                                <Item onClick={handleToCashout}>
                                    <LabelCtn>
                                        <BillIcon />
                                        <Label>Cash Out</Label>                            
                                    </LabelCtn>
                                <Button src={RightArrowSvg}/>
                                </Item>
								{tickets.length > 0 && (
									<Item onClick={handleToTickets}>
										<LabelCtn>
											<TicketIcon indicator={unredeemedIndicator}/>
											<Label>Your Tickets</Label>                            
										</LabelCtn>
									<Button src={RightArrowSvg}/>
									</Item>
								)}
                                <Item>
                                    <LabelCtn>
                                        <ContactIcon />
                                        <Label>Contact Us</Label>                            
                                    </LabelCtn>
                                <Button src={RightArrowSvg}/>
                                </Item>

                                <SmallItem>
                                    Your Wallet
                                </SmallItem>

                                <Item onClick={handleShowPhrase}>
                                    <LabelCtn>
                                        <KeyIcon />
                                        <Label>Show Seed Phrase</Label>                            
                                    </LabelCtn>
                                <Button src={RightArrowSvg}/>
                                </Item>
                                <Item onClick={() => handleCopyAddress(wallet.Path1899.cashAddress)}>
                                    <LabelCtn>
                                        <LightWalletIcon />
                                        <Label>Wallet Address</Label>                            
                                    </LabelCtn>
                                    <Value>
                                        ecash:qzrw...jd93
                                    </Value>
                                    <StyledCopyOutlined />                            
                                </Item>
                                <Item onClick={handleChangeEmail}>
                                    <LabelCtn>
                                        <EnvelopeIcon />
                                        <Label>Email</Label>                            
                                    </LabelCtn>                            
                                    <Value>youraddress@email.com</Value>
                                    <Button src={PencilIconSvg}/>                            
                                </Item>

                                <SmallItem onClick={handleImportWallet}>
                                    <Label>
                                        Import Wallet
                                    </Label>
                                <Button src={RightArrowSvg}/>

                                </SmallItem>
                                <SmallItem onClick={handleToTos}>
                                    <Label>
                                        Terms of Use
                                    </Label>
                                <Button src={RightArrowSvg}/>

                                </SmallItem>
                                <SmallItem onClick={handleToPrivacyPolicy}>
                                    <Label>
                                        Privacy Policy
                                    </Label>
                                <Button src={RightArrowSvg}/>

                                </SmallItem>
                                <SmallItem onClick={handleToRegulation}>
                                    <Label>
                                        Regulatory Information
                                    </Label>
                                <Button src={RightArrowSvg}/>

                                </SmallItem>
                                <SmallItem onClick={handleToResponsibleGaming}>
                                    <Label>
                                        Responsible Gaming Policy
                                    </Label>
                                <Button src={RightArrowSvg}/>
                                </SmallItem>                        
                            </>
                        )}
                        {selection === "Tickets" &&
                            <TicketHistory 
                                tickets={tickets}
								passLoadingStatus={passLoadingStatus}
							/>
                        }
                        {selection === "Seed Phrase" &&
                        <SeedPhraseCtn>
                            <SeedPhrase 
                                phrase={wallet.mnemonic ? wallet.mnemonic : ""}
                            />
                            <SecondaryButton type="button" onClick={handleCopySeedPhrase}>
                                <CopyboardIcon src={CopyboardSvg} />
                                Copy
                            </SecondaryButton>                    
                        </SeedPhraseCtn>

                        }
                        {selection === "Email" &&
                            <Email />
                        }
                        {selection === "Import Wallet" && 
                            <ImportWallet 
                                currentAddress={wallet.Path1899.cashAddress}
                                passLoadingStatus={passLoadingStatus}
                            />
                        }
                    </WalletCtn>                
                )}
                <FooterCtn>
                    <StyledSupportBar />
                </FooterCtn>
            </StyledFadeInOut>        
        </>

    );
};

Wallet.defaultProps = {
    paymentUrl: "",
    paymentRequest: {},
    onSuccess: (hash, link) => {
        console.log("Payment successful", hash)
        console.log("Explorer view:", link);
    },
    onCancel: status => {
        console.log("Payment cancelled:", status);
    },
    origin: "/",
    passLoadingStatus: () => {
        console.log("placeholder function");
    },
};

Wallet.propTypes = {
    paymentUrl: PropTypes.string,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    passLoadingStatus: PropTypes.func,
    origin: PropTypes.string,
};

export default Wallet;
