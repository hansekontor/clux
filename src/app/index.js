// node modules
import React, { Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { CashoutProvider } from "blocklotto-sdk";

import Layout from "@components/Layout";
import Loading from "@components/Loading";
import Tickets from "./Tickets";
import Cashout from "./Cashout";
import WaitingRoom from "./WaitingRoom";
import Result from "./Result";

// react components
const Select = lazy(() => import("./Select"));
const NotFound = lazy(() => import("./NotFound"));

const App = () => {
  const codeSplitLoader = <Loading>Loading</Loading>;

  return (
    <Layout>
      <Suspense fallback={codeSplitLoader}>
        <Switch>
          <Route path="/select">
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
          <Route path="/cashout">
            <CashoutProvider>
              <Cashout />
            </CashoutProvider>
          </Route>
          <Redirect exact from="/" to="/select" />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
};

export default App;
