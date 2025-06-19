import styled, { keyframes } from "styled-components"
import { BackgroundCover } from "../Common"

export const Backdrop = styled(BackgroundCover)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid ${({ theme }) => theme.color.grey[200] || '#e2e8f0'};
  border-top-color: ${({ theme }) => theme.color.primary.main || '#3182ce'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

export const Message = styled.div`
  margin-top: 1rem;
  font-size: ${({ theme }) => theme.typography.fontSize || '0.875rem'};
`

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(6)};
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.color.common.white || '#fff'};
  border-radius: ${({ theme }) => theme.shape.lg || '0.5rem'};
  box-shadow: ${({ theme }) => theme.shadows[6] || '0 4px 30px rgba(0, 0, 0, 0.1)'};
`