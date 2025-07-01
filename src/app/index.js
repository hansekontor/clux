// node modules
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { CashoutProvider } from "blocklotto-sdk";

import Layout from "@components/Layout";
import Tickets from "./Tickets";
import Cashout from "./Cashout";
import WaitingRoom from "./WaitingRoom";
import Result from "./Result";
import Wallet from "./Wallet";
import Affiliate from "./Affiliate";
import Select from "./Home";
import NotFound from "./NotFound";

const App = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/home">
          <Select />
        </Route>
        <Route path="/tickets">
          <Tickets />
        </Route>
        <Route path="/waitingroom">
          <WaitingRoom />
        </Route>
        <Route path="/result">
          <Result />
        </Route>
        <Route path="/wallet">
          <Wallet />
        </Route>
        <Route path="/affiliate">
          <Affiliate />
        </Route>
        <Route path="/cashout">
          <CashoutProvider>
            <Cashout />
          </CashoutProvider>
        </Route>
        <Redirect exact from="/" to="/home" />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default App;
