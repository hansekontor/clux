import * as React from 'react';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { currency } from '@core/utils/ticker';

import CnmiPng from '@assets/images/cnmi.png';
import GiftboxSvg from '@assets/svgs/giftbox.svg';
import QuestionMarkSvg from '@assets/svgs/questionmark.svg';
import WhiteWalletSvg from '@assets/svgs/wallet_white.svg';
import VideoSvg from '@assets/svgs/video.svg';
import PicturesSvg from '@assets/svgs/pictures.svg';
import SmartphoneSvg from '@assets/svgs/smartphone.svg';
import TicketFilledSvg from '@assets/svgs/ticket_filled.svg';
import BillSvg from '@assets/svgs/bill.svg';
import TicketSvg from '@assets/svgs/ticket.svg';
import ContactSvg from '@assets/svgs/contact.svg';
import KeySvg from '@assets/svgs/key.svg';
import WalletSvg from '@assets/svgs/wallet.svg';
import EnvelopeSvg from '@assets/svgs/envelope.svg';
import CardIconSvg from '@assets/svgs/card_icon.svg'
import LockIconSvg from '@assets/svgs/lock_icon.svg'
import MastercardIconSvg from '@assets/svgs/mastercard_icon.svg'
import VisaIconSvg from '@assets/svgs/visa_icon.svg'




export const CashLoadingIcon = <LoadingOutlined className="cashLoadingIcon" />;

export const CashReceivedNotificationIcon = () => (
    <Image height={'33px'} width={'30px'} src={currency.logo} preview={false} />
);

export const TokenReceivedNotificationIcon = () => (
    <Image
        src={currency.tokenLogo}
        height={'33px'}
        width={'30px'}
        preview={false}
    />
);

export const LoadingBlock = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    flex-direction: column;
    svg {
        width: 50px;
        height: 50px;
        fill: #000000;
    }
`;

export const CashLoader = () => (
    <LoadingBlock>
        <LoadingOutlined />
    </LoadingBlock>
);

// Footer Icons
const MediumDarkCircle = styled.div`
    background-color: #1A1826;
    border-radius: 20px;
    height: 40px;
    width: 40px;
    cursor: pointer;
    text-align: center;
    cursor: pointer;    
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const MediumCircleIcon = styled.img`
    width: 24px;
    height: 24px;
    position: absolute;
`;
const AlertCtn = styled.div`
    background-color: red;
    border-radius: 40px;
    position: absolute;
    top: 0px;
    left: 80%;
    height: 12px;
    width: 12px;
    display: flex; 
    justify-content: center;
    align-items: center;    
`;
const Indicator = styled.div`
    font-size: 9px;
    color: white;
    font-weight: 600;
    font-family: Helvetica;
`;
export const Alert = ({
    indicator
}) => {
    return (
        <AlertCtn>
            <Indicator>{indicator}</Indicator>
        </AlertCtn>
    )
}

export const CnmiIcon = ({...props}) => {
    return (
        <MediumDarkCircle {...props}>
            <img src={CnmiPng}/>
        </MediumDarkCircle>        
    )
}

export const CashoutIcon = ({...props}) => {
    return (
        <MediumDarkCircle {...props}>
            <MediumCircleIcon src={GiftboxSvg} />
        </MediumDarkCircle>  
    )
}

export const HelpIcon = ({...props}) => {
    return (
        <MediumDarkCircle {...props}>
            <MediumCircleIcon src={QuestionMarkSvg} />
        </MediumDarkCircle>  
    )
}

export const WalletIcon = ({
    indicator,
    ...props
}) => {
    return (
        <MediumDarkCircle {...props}>
            {indicator > 0 && <Alert indicator={indicator} />}
            <MediumCircleIcon src={WhiteWalletSvg} />
        </MediumDarkCircle>  
    )
}

// KYC icons
const LargeCircle = styled.div`
    background-color: #D0CED8;
    border-radius: 177px;
    height: 64px;
    width: 64px;
    cursor: pointer;
    cursor: pointer;
    text-align: center;
    cursor: pointer;    
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const MediumWhiteCircle = styled(MediumDarkCircle)`
    background-color: #FFFFFF;
`;
export const VideoIcon = () => {
    return (
        <LargeCircle>
            <img src={VideoSvg} />
        </LargeCircle>
    )
}
export const PicturesIcon = () => {
    return (
        <MediumWhiteCircle>
            <img src={PicturesSvg}/>
        </MediumWhiteCircle>
    )
}
export const SmartphoneIcon = () => {
    return (
        <MediumWhiteCircle>
            <img src={SmartphoneSvg} />
        </MediumWhiteCircle>
    )
}

// checkout icons
export const TicketFilledIcon = () => {
    return (
        <MediumWhiteCircle>
            <img src={TicketFilledSvg}/>
        </MediumWhiteCircle>
    )
}

// wallet icons
const SmallCircle = styled.div`
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
const SmallGreenCircle = styled(SmallCircle)`
    background-color: #D2EFD0;
`;
const SmallYellowCircle = styled(SmallCircle)`
    background-color: #FBEDD2;
`;
export const BillIcon = ({...props}) => {
    return (
        <SmallGreenCircle {...props}>
            <img src={BillSvg}/>
        </SmallGreenCircle>
    )
}
export const TicketIcon = ({
    indicator,
	...props
}) => {
    return (
        <SmallYellowCircle {...props}>
            {indicator > 0 && <Alert indicator={indicator} />}
            <img src={TicketSvg} />
        </SmallYellowCircle>
    )
}
export const ContactIcon = () => {
    return (
        <SmallCircle>
            <img src={ContactSvg} />
        </SmallCircle>
    )
}
export const KeyIcon = () => {
    return (
        <SmallCircle>
            <img src={KeySvg} />
        </SmallCircle>
    )
}
export const LightWalletIcon = () => {
    return (
        <SmallCircle>
            <img src={WalletSvg} />
        </SmallCircle>
    )
}
export const EnvelopeIcon = () => {
    return (
        <SmallCircle>
            <img src={EnvelopeSvg} />
        </SmallCircle>
    )
}

const CardIcons = styled.div`
    margin: auto;
    gap: 12px;
    border-radius: 12px;
    background-color: #ffffff;
    padding: 7px;
    width: fit-content;
    display: flex;
`;
export const CardIconBox = () => {
    return (
        <CardIcons>
            <img src={CardIconSvg} />
            <img src={LockIconSvg} />
            <img src={MastercardIconSvg} />
            <img src={VisaIconSvg} />
        </CardIcons>
    )
}