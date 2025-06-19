import styled, { css } from 'styled-components';

export const VisuallyHidden = css`
  position: absolute;
  white-space: nowrap;
  width: 1px;
  height: 1px;
  overflow: hidden;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  margin: -1px;
`;

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  font-size: inherit;
  font-family: inherit;
  appearance: none;
  transition: all 120ms ease;
  user-select: none;
  cursor: pointer;
  vertical-align: baseline;
  line-height: inherit;
  margin: 0;
  padding: 0;
  ${VisuallyHidden}

  & + label {
    transition: all 120ms ease;
    user-select: none;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    margin: 0 auto;
    width: 100%;
    padding: 0;
    line-height: inherit;

    &::before {
        content: '';
        transition: all 120ms ease-in-out;
        will-change: transform, background-color, border-color;
        background-color: ${({ theme }) => theme.color.grey[200]};
        display: inline-block;
        border: 1px solid;
        border-color: ${({ theme }) => theme.color.grey[200]};
        border-radius: 0.3125em;
        width: 1.125em;
        min-width: 1.125em;
        height: 1.125em;
        min-height: 1.125em;
        background-size: 25%;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: ${({ theme }) => theme.spacing(1)};
        line-height: 1.5;
        margin-top: 0.05em;
        transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
    }
  }

  &:hover + label::before {
    background-color: ${({ theme }) => theme.color.grey[300]};
  }

  &:active + label::before {
    background-color: ${({ theme }) => theme.color.primary.light};
    transform: scale3d(0.95, 0.95, 1);
  }

  &:focus + label::before {
    background-color: ${({ theme }) => theme.color.grey[300]};
    border-color: ${({ theme }) => theme.color.grey[300]};
  }

  &:checked + label::before {
    background-color: ${({ theme }) => theme.color.primary.main};
    border: 1px solid transparent;
    background-size: 75%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M15.854,3.146l-1.5-1.5c-.195-.195-.512-.195-.707,0L5.5,9.793l-3.146-3.146c-.195-.195-.512-.195-.707,0L.146,8.146c-.195,.195-.195,.512,0,.707l5,5c.098,.098,.226,.146,.354,.146s.256-.049,.354-.146L15.854,3.854c.195-.195,.195-.512,0-.707Z' fill='%23ffffff'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
    transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
  }

  &:checked:hover + label::before {
    background-color: ${({ theme }) => theme.color.primary.dark};
  }

  &:checked:active + label::before {
    background-color: ${({ theme }) => theme.color.primary.dark};
  }

  &:checked:focus + label::before {
    background-color: ${({ theme }) => theme.color.primary.dark};
    border-color: ${({ theme }) => theme.color.primary.dark};
  }
`;

export const Wrapper = styled.div`
  width: 100%;
`;