import styled from "styled-components";

export const Dollar = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 2.61 / 1;
  width: 90vw;
  max-width: 600px;
  background: radial-gradient(circle at center, #e3e7dd 40%, #c2c7ba 100%);
  border: 2px solid #2d4739;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 0 0 4px rgba(45, 71, 57, 0.2);
  color: #2d4739;
  font-family: "Georgia", serif;
  font-size: 2rem;
  font-weight: bold;
  overflow: hidden;
  rotate: -2deg;
`;