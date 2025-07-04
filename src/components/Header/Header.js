import React from 'react';
import { useHistory } from 'react-router-dom';
import { StyledHeader, StyledHeaderIcon } from './Header.styles';

// assets
import CluxLogo from '@assets/images/clux_logo.png';

export default function Header({ ...props }) {

    const history = useHistory();

    const handleOnClick = () => {
        return history.push("/select");
    }

    return (
        <StyledHeader {...props}>
            <StyledHeaderIcon src={CluxLogo} onClick={handleOnClick} />
        </StyledHeader>
    )
}
