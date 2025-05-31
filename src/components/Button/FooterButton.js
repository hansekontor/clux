import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CashoutIcon, HelpIcon, WalletIcon } from '@components/Icons';

export const WalletButton = ({
    returnTo,
    indicator
}) => {
    const history = useHistory();

    const handleToSettings = () => {
        history.push({ pathname: "/wallet", state: { returnTo } });
    }

    return (
        <WalletIcon onClick={() => handleToSettings()} indicator={indicator} />
    )
}

WalletButton.defaultProps = {
    prev: "/select",
};
WalletButton.propTypes = {
    prev: PropTypes.string,
};


export const HelpButton = () => {
    const handleToHelp = () => {
        window.location.href = "https://dollar.mp";
    }

    return (
        <HelpIcon onClick={() => handleToHelp()} />
    )
}


export const CashoutButton = ({
    returnTo,
}) => {
    const history = useHistory();

    const handleToSettings = () => {
        history.push({ pathname: "/cashout", state: { returnTo } });
    }

    return (
        <CashoutIcon onClick={() => handleToSettings()} />
    )
}

CashoutButton.defaultProps = {
    returnTo: "/select",
};
CashoutButton.propTypes = {
    returnTo: PropTypes.string,
};