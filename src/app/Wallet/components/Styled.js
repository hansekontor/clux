import styled from 'styled-components';
import FadeInOut from '@components/FadeInOut';
import PrimaryButton from '@components/PrimaryButton';
import { Scrollable } from '@components/Container';
import { textItem } from '@components/CssUtil';


const StyledFadeInOut = styled(FadeInOut)`
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.checkout.background};
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const WalletCtn = styled(Scrollable)`
    justify-content: flex-start;
    width: 90%;
    gap: 12px;
    padding-top: 12px;
    div {
        text-indent: 0;
    }
`;
const Item = styled.div`
    ${textItem}
    border-radius: 7px;
    background-color:${props => props.theme.app.background};
    min-height: 60px;
    display: flex;
    justify-content: space-between; 
    align-items: center;
`;
const Circle = styled.div`
    position: relative;
    background-color: #D0CED8;
    border-radius: 20px;
    height: 35px;
    width: 35px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const LabelCtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-left: 12px;
`;
const Link = styled.a`
    text-decoration: none;
    display: inline-flex;
    justify-content: space-between;
    padding-right: 10px;
`;
const Value = styled.span`
    font-size: 12px;
    color: #98999c;
    flex-grow: 1;
    text-align: right;
    padding-right: 10px;
    display: block;
`;
const Label = styled.div`
    font-weight: 600;
    line-height: 30px;
`;
const SmallItem = styled.div`
    width: 100%;
    font-weight: 600;
    border-bottom: 1px solid #EAEAEA;
    display: flex;
    justify-content: space-between;
    height: 38px;
    align-items: center;
    cursor: pointer;
`;
const ImgButton = styled.img`
    padding-right: 10px;
`;
const CopyboardIcon = styled.img`
    position: relative;
    top: 3px;
    margin-right: 5px;
`;
const SeedPhraseCtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90%;
    gap: 12px;
    div, p {
        text-align: center;
    }
`;
const StyledPrimaryButton = styled(PrimaryButton)`
	font-family: "Helvetica";
	font-size: 14px;
	font-weight: 600;
`;
const CopyButton = styled(StyledPrimaryButton)`
	background-color: #F6F6F6;
`;

export {
    StyledFadeInOut, 
    WalletCtn, 
    Item, 
    Circle, 
    LabelCtn, 
    Link,
    Value, 
    Label, 
    SmallItem, 
    ImgButton,
    CopyboardIcon, 
    SeedPhraseCtn, 
    StyledPrimaryButton, 
    CopyButton
}