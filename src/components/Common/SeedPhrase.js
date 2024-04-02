import React, { useState } from "react";
import styled from 'styled-components';
import { Collapse } from 'antd';

const SeedPhraseCtn = styled.div`
    width: 100%;
`;
const StyledCollapse = styled(Collapse)`
    border: none;
    background-color: #ffffff;
    width: 90%;
    margin-left: 5%;

    .ant-collapse-item > .ant-collapse-header {
        color: black;
        font-family: "Inter-Medium", Helvetica;
        font-size: 14px;
    }
`;
const PanelStyle = {
    backgroundColor: "#ededed",
    border: "1px solid #333333",
    textColor: "black",
    marginBottom: "5px",
    cursor: "pointer",
    borderRadius: "40px",
    overflow: "hidden",
};

const SeedPhrase = ({ 
    phrase 
}) => {
    const [activeKey, setActiveKey] = useState();

    // placeholder txs

    const handleChange = (key) => {
        console.log("handleChange key", key);
        setActiveKey(key);
    }



    return (
        <SeedPhraseCtn>
            <StyledCollapse defaultActiveKey={["1"]} activeKey={activeKey} onChange={(key) => handleChange(key)}>
                <Collapse.Panel header="Show Seed Phrase" key="1" style={PanelStyle}>
                    <div>
                        {phrase}
                    </div>
                </Collapse.Panel>
            </StyledCollapse>
        </SeedPhraseCtn>
    );
};

export default SeedPhrase;