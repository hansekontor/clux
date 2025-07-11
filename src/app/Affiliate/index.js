// node modules
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// core functions
import { useApp } from 'blocklotto-sdk';

// react components
import Header from './components/Header';
import { AffiliateContainer, StickyContainer } from './components/Container';
import Content from './components/Content';
import Drawer from './components/Drawer';
import Activity from './components/Activity';

const Affiliate = () => {
    const history = useHistory();
    const { getAffiliateLink, email, getAffiliateTicketData } = useApp();

    const [affiliateTickets, setAffiliateTickets] = useState([]);

    useEffect(() => {
        if (!email) {
            history.push("/select");
        }
    }, [])

    useEffect(() => {
        const fetchAffiliateTickets = async () => {
            try {
                const affTicketData = await getAffiliateTicketData();
                const affTickets = affTicketData.txs;
                setAffiliateTickets(affTickets);
            } catch(err) {
                console.error(err);
            }
        };

        fetchAffiliateTickets();
    }, []);

    const link = getAffiliateLink({
        path: "/#/select"
    });

    return (
        <AffiliateContainer>
            <Header />
            <StickyContainer>
                <Content value={link} />
                <Drawer>
                    <Activity ticketActivity={affiliateTickets}/>
                </Drawer>
            </StickyContainer>
        </AffiliateContainer>
    )
}

export default Affiliate;
