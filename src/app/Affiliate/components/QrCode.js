import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import styled from "styled-components";

const QrWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const QrContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
`;

export default function QrCode({ value }) {
  if (!value) {
    return null;
  }

  return (
    <QrWrapper>
      <QrContainer>
        <QRCodeCanvas value={value} size={164} />
      </QrContainer>
    </QrWrapper>
  );
}
