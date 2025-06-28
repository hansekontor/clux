// node modules
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// core functions
import { useApp } from 'blocklotto-sdk';

// react components
import Header from './components/Header';
import { AffiliateContainer, StickyContainer } from './components/Container';
import Content from './components/Content';
import Drawer from './components/Drawer';
import Activity from './components/Activity';

const ticketActivity = Array.from({ length: 15 }); // Placeholder for ticket activity data

const Affiliate = () => {
    const history = useHistory();
    const { affiliate, email } = useApp();

    console.log("affiliate", affiliate);
    console.log("affiliate.aid", affiliate?.aid);
    console.log("affiliate.url", affiliate?.url);

    useEffect(() => {
        if (!email) {
            history.push("/select");
        }
    }, [])

    return (
        <AffiliateContainer>
            <Header />
            <StickyContainer>
                <Content value={affiliate?.url} />
                <Drawer>
                    <Activity ticketActivity={ticketActivity}/>
                </Drawer>
            </StickyContainer>
        </AffiliateContainer>
    )
}

export default Affiliate;
