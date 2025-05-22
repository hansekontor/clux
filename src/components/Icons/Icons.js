import * as React from 'react';
import { LoadingOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import {
    StyledAlertContainer,
    StyledCardIcons,
    StyledIndicator,
    StyledLargeCircle,
    StyledLoadingBlock,
    StyledMediumCircleIcon,
    StyledMediumDarkCircle,
    StyledMediumWhiteCircle,
    StyledSmallCircle,
    StyledSmallGreenCircle,
    StyledSmallYellowCircle
} from './Icons.styles';

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

export const CashLoader = () => (
    <StyledLoadingBlock>
        <LoadingOutlined />
    </StyledLoadingBlock>
);

// Footer Icons
export const Alert = ({
    indicator
}) => {
    return (
        <StyledAlertContainer>
            <StyledIndicator>{indicator}</StyledIndicator>
        </StyledAlertContainer>
    )
}

export const CnmiIcon = ({ ...props }) => {
    return (
        <StyledMediumDarkCircle {...props}>
            <img src={CnmiPng} />
        </StyledMediumDarkCircle>
    )
}

export const CashoutIcon = ({ ...props }) => {
    return (
        <StyledMediumDarkCircle {...props}>
            <StyledMediumCircleIcon src={GiftboxSvg} />
        </StyledMediumDarkCircle>
    )
}

export const HelpIcon = ({...props}) => {
    return (
        <StyledMediumDarkCircle {...props}>
            <StyledMediumCircleIcon src={QuestionMarkSvg} />
        </StyledMediumDarkCircle>  
    )
}

export const WalletIcon = ({
    indicator,
    ...props
}) => {
    return (
        <StyledMediumDarkCircle {...props}>
            {indicator > 0 && <Alert indicator={indicator} />}
            <StyledMediumCircleIcon src={WhiteWalletSvg} />
        </StyledMediumDarkCircle>  
    )
}

// KYC icons
export const VideoIcon = () => {
    return (
        <StyledLargeCircle>
            <img src={VideoSvg} />
        </StyledLargeCircle>
    )
}

export const PicturesIcon = () => {
    return (
        <StyledMediumWhiteCircle>
            <img src={PicturesSvg}/>
        </StyledMediumWhiteCircle>
    )
}

export const SmartphoneIcon = () => {
    return (
        <StyledMediumWhiteCircle>
            <img src={SmartphoneSvg} />
        </StyledMediumWhiteCircle>
    )
}

// checkout icons
export const TicketFilledIcon = () => {
    return (
        <StyledMediumWhiteCircle>
            <img src={TicketFilledSvg}/>
        </StyledMediumWhiteCircle>
    )
}

// wallet icons
export const BillIcon = ({...props}) => {
    return (
        <StyledSmallGreenCircle {...props}>
            <img src={BillSvg}/>
        </StyledSmallGreenCircle>
    )
}

export const TicketIcon = ({
    indicator,
    ...props
}) => {
    return (
        <StyledSmallYellowCircle {...props}>
            {indicator > 0 && <Alert indicator={indicator} />}
            <img src={TicketSvg} />
        </StyledSmallYellowCircle>
    )
}

export const ContactIcon = () => {
    return (
        <StyledSmallCircle>
            <img src={ContactSvg} />
        </StyledSmallCircle>
    )
}

export const KeyIcon = () => {
    return (
        <StyledSmallCircle>
            <img src={KeySvg} />
        </StyledSmallCircle>
    )
}

export const LightWalletIcon = () => {
    return (
        <StyledSmallCircle>
            <img src={WalletSvg} />
        </StyledSmallCircle>
    )
}

export const EnvelopeIcon = () => {
    return (
        <StyledSmallCircle>
            <img src={EnvelopeSvg} />
        </StyledSmallCircle>
    )
}

export const CardIconBox = () => {
    return (
        <StyledCardIcons>
            <img src={CardIconSvg} />
            <img src={LockIconSvg} />
            <img src={MastercardIconSvg} />
            <img src={VisaIconSvg} />
        </StyledCardIcons>
    )
}

export const QrCodeIcon = () => {
    return (
        <StyledSmallCircle>
            <QrcodeOutlined />
        </StyledSmallCircle>
    )
}