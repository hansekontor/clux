// node modules
import React from 'react';

// core functions
import { useApp } from 'blocklotto-sdk';

// react components
import Navigation from '@components/Navigation';
import Header from '@components/Header';

const Affiliate = () => {
    const { affiliate } = useApp();
    
    console.log("affiliate", affiliate);
    console.log("affiliate.aid", affiliate?.aid);
    console.log("affiliate.url", affiliate?.url);

    return (
        <>
            <div>

            </div>
        </>
    )
}

export default Affiliate;
