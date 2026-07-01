import styled from "styled-components";
import { useState } from "react";
import { variable } from "../../styles/variables";
import { Device } from "../../styles/breackpoints";
import { TablaKardex } from "./Tablas/TablaKardex";

export function Tabs({ data, SetopenRegistro, setdataSelect, setAccion }) {
    const [activeTab, setActiveTab] = useState(0);
    const handleClick = (index) => {
        setActiveTab(index);
    };
    return (
        <Container className="container" $activeTab={activeTab}>
            <ul className="tabs">
                <li className={activeTab === 0 ? "active" : ""} onClick={() => handleClick(0)}>
                    {<variable.iconopie />}
                    Kardex
                </li>
                <li className={activeTab === 1 ? "active" : ""} onClick={() => handleClick(1)}>
                    {<variable.iconopie />}
                    Topic 2
                </li>
                <span className="glider"></span>
            </ul>
            <div className="tab-content">
                {activeTab === 0 && (
                    <TablaKardex
                        data={data}
                        SetopenRegistro={SetopenRegistro}
                        setdataSelect={setdataSelect}
                        setAccion={setAccion}
                    />
                )}
                {activeTab === 1 && <span>tab2</span>}
                {activeTab === 2 && <span>tab3</span>}
            </div>
        </Container>
    );
}
const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .tabs {
        list-style: none;
        display: flex;
        position: relative;
        border-radius: 100px;
        justify-content: space-between;
        top: 0;
        left: 0;
        flex-direction: column;
        @media ${Device.tablet} {
            flex-direction: row;
        }
        li {
            gap: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 54px;
            width: 180px;
            font-size: 1.25rem;
            font-weight: 500;
            border-radius: 99px;
            cursor: pointer;
            transition: color 0.15s ease-in;
            position: relative;
            z-index: 2;
        }
        .glider {
            position: absolute;
            color: #fff;
            display: flex;
            left: 0;
            top: 0;
            height: 54px;
            width: 4px;
            background-color: #2EC971;
            z-index: 1;
            border-radius: 15px;
            transition: 0.25s ease-out;
            transform: translateY(calc(${(props) => props.$activeTab} * 54px));
            box-shadow: 0px 10px 20px -3px #2EC971;
            @media ${Device.tablet} {
                transform: translateX(calc(${(props) => props.$activeTab} * 180px));
                height: 4px;
                width: 180px;
                top: auto;
                bottom: 0;
            }
        }
    }
    .tab-content {
        margin-top: 20px;
        height: 100%;
        width: 100%;
    }
`;