import React from "react";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";

// react components
import { Flex, Divider } from "@components/Common";
import ButtonLink from "./components/ButtonLink";
import Typography from "@components/Typography";
import Email from "./Email";
import Address from "./Address";
import Import from "./Import";
import Export from "./Export";
import NotFound from "../NotFound";

const walletMenu = [
  { label: "Email", path: "/wallet/email" },
  { label: "Wallet Address", path: "/wallet/address" },
  { label: "Import Wallet", path: "/wallet/import" },
  { label: "Export Wallet", path: "/wallet/export" },
];

export default function Wallet() {
  const { path } = useRouteMatch();
  const history = useHistory();

  const handleClick = (path) => {
    history.push(path);
  };

  return (
    <Switch>
      <Route exact path={`${path}/email`} component={Email} />
      <Route exact path={`${path}/address`} component={Address} />
      <Route exact path={`${path}/import`} component={Import} />
      <Route exact path={`${path}/export`} component={Export} />
      <Route path={path}>
        <Flex direction="column" gap={1} paddingTop={2}>
          <Flex direction="column">
            <Typography variant="h6">Your Wallet</Typography>
            <Divider />
          </Flex>
          {walletMenu.map((item) => (
            <ButtonLink key={item.path} onClick={() => handleClick(item.path)}>
              {item.label}
            </ButtonLink>
          ))}
        </Flex>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}
