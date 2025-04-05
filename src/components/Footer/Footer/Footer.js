import React from 'react';
import { StyledFooter } from './Footer.styles';
import PlayerNumbers from '@components/PlayerNumbers';
import Button from '@components/Button';
import SupportBar from '../SupportBar';
import PropTypes from 'prop-types';

function Footer({
    origin = "/select",
    randomNumbers,
    buttonOnClick,
    buttonText,
    ticketIndicator,
    slpBalances,
    variant = 'default',
    children
}) {
    if (variant === 'empty') {
        return (
            <StyledFooter>
                {children || null}
            </StyledFooter>
        )
    }

    return (
        <StyledFooter>
            {randomNumbers &&
                <PlayerNumbers fixedRandomNumbers={randomNumbers} />
            }
            {buttonText &&
                <>
                    <Button onClick={buttonOnClick}>
                        {buttonText}
                    </Button>
                </>
            }
            <SupportBar returnTo={origin} ticketIndicator={ticketIndicator} slpBalances={slpBalances} />
        </StyledFooter>
    )
}

Footer.defaultProps = {
    origin: "/select",
}
Footer.propTypes = {
    origin: PropTypes.string,
    randomNumbers: PropTypes.array,
    buttonOnClick: PropTypes.func,
    buttonText: PropTypes.string,
    ticketIndicator: PropTypes.any,
    slpBalances: PropTypes.any,
    children: PropTypes.node,
    variant: PropTypes.oneOf(['default', 'empty']),
  }

export default Footer;