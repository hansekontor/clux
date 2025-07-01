import React from "react";

import {
  TicketIcon,
  LotteryIcon,
  WalletIcon,
  CashoutIcon,
  ReferIcon,
  TermsIcon,
  PrivacyIcon,
  RegulationsIcon,
  ResponsibleIcon,
} from "@components/Icons";

const menuItems = [
  { label: "Lottery", icon: <LotteryIcon />, href: "/home", internal: true },
  { label: "Tickets", icon: <TicketIcon />, href: "/tickets", internal: true },
  { label: "Wallet", icon: <WalletIcon />, href: "/wallet", internal: true },
  { label: "Cashout", icon: <CashoutIcon />, href: "/cashout", internal: true },
  {
    label: "Refer a Friend",
    icon: <ReferIcon />,
    href: "/affiliate",
    internal: true,
  },
  {
    label: "Terms of Use",
    icon: <TermsIcon />,
    href: "https://dollar.mp",
    internal: false,
  },
  {
    label: "Privacy Policy",
    icon: <PrivacyIcon />,
    href: "https://dollar.mp",
    internal: false,
  },
  {
    label: "Regulatory Information",
    icon: <RegulationsIcon />,
    href: "https://dollar.mp",
    internal: false,
  },
  {
    label: "Responsible Gaming Policy",
    icon: <ResponsibleIcon />,
    href: "https://dollar.mp",
    internal: false,
  },
];

export default menuItems;
