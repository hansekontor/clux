import styled from "styled-components"

export const SelectContainer = styled.div`
    position: relative;
    width: 100%;
`

export const SelectedValue = styled.div`
    background-color: ${({ theme }) => theme.color.grey[200]};
    border: none;
    transition: ${({ theme }) =>
        `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`};
    border-radius: ${({ theme, open }) => open ? `${theme.shape.sm} ${theme.shape.sm} 0 0` : theme.shape.sm};
    padding: ${({ theme }) => theme.spacing(1.5)};
    padding-left: ${({ theme }) => theme.spacing(2.5)};
    padding-right: ${({ theme }) => theme.spacing(2.5)};
    width: ${({ fullWidth }) => fullWidth ? "100%" : "auto"};
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.typography.fontSize};
    display: flex;
    align-items: center;
    justify-content: space-between;


    &:hover {
        background-color: ${({ theme, open }) => open ? theme.color.grey[200] : theme.color.grey[300]};
    }
        
    &::after {
        content: '';
        display: inline-block;
        width: 0.5em;
        height: 0.5em;
        margin-left: 0.5em;
        border-right: 2px solid ${({ theme }) => theme.color.text.primary};
        border-bottom: 2px solid ${({ theme }) => theme.color.text.primary};
        transform: ${({ open }) => open ? 'rotate(-135deg)' : 'rotate(45deg)'};
        transition: transform 0.2s ease;
        transform-origin: center;
        pointer-events: none;
        position: relative;
        top: -3px;
    }
`

export const SearchOverlay = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: ${({ theme }) => theme.spacing(1.5)};
    padding-left: ${({ theme }) => theme.spacing(2.5)};
    padding-right: ${({ theme }) => theme.spacing(2.5)};
    border: none;
    border-radius: ${({ theme }) => `${theme.shape.sm} ${theme.shape.sm} 0 0`};
    outline: none;
    z-index: 2;
    background: ${({ theme }) => theme.color.grey[200]};
    box-sizing: border-box; 
`

export const Dropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.color.grey[50]};
    border-top: none;
    border-radius: ${({ theme }) => `0 0 ${theme.shape.sm} ${theme.shape.sm}`};
    outline: none;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1;
`

export const Option = styled.div`
  padding: 10px 12px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.grey[300]};
  }

  ${({ disabled, theme }) =>
        disabled &&
        `
    color: #aaa;
    cursor: not-allowed;
    &:hover {
      background-color: ${theme.color.common.white}};
    }
  `}
`