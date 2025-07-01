import styled from 'styled-components';

const Divider = styled.hr`
    border: none;
    border-top: ${({ vertical }) => (vertical ? 'none' : '1px solid')};
    border-left: ${({ vertical }) => (vertical ? '1px solid' : 'none')};
    border-color: ${({ theme }) => theme.color.divider};
    width: ${({ vertical }) => (vertical ? '0px' : '100%')};
    height: ${({ vertical }) => (vertical ? '100%' : '0px')};
`;

export default Divider;