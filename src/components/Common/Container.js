import styled from 'styled-components';


// checkout needs background EAEAEA
export const Scrollable = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    z-index: 1;
    flex-grow: 1;
`;
export const Background = styled.div`
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0; 
    width: 100%;
    height: 100%;
`;
export const Column = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 12px;
`;
export const Overlay = styled.div`
    align-items: center;
	position: absolute;
	flex-direction: column;
	max-width: 480px;
	top: 0;
	right: 0;
	bottom: 0;
	right: 0 ;
	background: rgba(0, 0, 0, 0.5);
	transition: opacity 200ms;
	z-index: 10;
    width: 100vh;
`;
export const WidgetBody = styled.div`
    width: 100%;
    max-width: 480px;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 11;
    height: fit-content;
    bottom: 0;
`;