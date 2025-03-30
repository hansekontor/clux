import * as React from 'react';
import { CashLoader } from '@components/Icons';
import { AlertMsg } from '@components/Atoms';

const ApiError = () => {
    return (
        <>
            <AlertMsg>
                <b>API connection lost.</b>
                <br /> Re-establishing connection...
            </AlertMsg>
            <CashLoader />
        </>
    );
};

export default ApiError;
