import React from "react";
import { StyledNotification } from "./Notification.styles";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ErrorIcon, InfoIcon, SuccessIcon } from "../Icons";

export default function Notification({ type, message }) {
  return (
    <StyledNotification type={type}>
      {type === "success" && <SuccessIcon />}
      {type === "error" && <ErrorIcon />}
      {type === "info" && <InfoIcon />}
      <div>{message}</div>
    </StyledNotification>
  );
}
