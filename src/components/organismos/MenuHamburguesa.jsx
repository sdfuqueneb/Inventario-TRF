import styled from "styled-components";
import { variable } from "../../styles/variables";
import { LinksArray, SecondarylinksArray} from "../../utils/dataEstatica";
import { ToggleTema } from "./ToggleTema";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export function MenuHamburguesa() {
    const [click, setClick] = useState(false);

    return(
        <Container>
            <Navbar>
                <section>
                    <HamburguerMenu onClick={() => setClick(!click)}>
                        <div id="menuToggle">
                            <label className={click ? "toggle active" : "toggle"} htmlFor="checkbox">
                                <div className="bar bar--top" />
                                <div className="bar bar--middle" />
                                <div className="bar bar--bottom" />
                            </label>
                        </div>
                    </HamburguerMenu>
                </section>
                <Menu $click = {click.toString()}>
                {LinksArray.map(({ icon, label, to }) => (
                    <div onClick={() => setClick(!click)} className="LinkContainer" key={label}>
                        <NavLink to={to} className="Links">
                            <div className="Linkicon">{icon}</div>
                                <span>{label}</span>
                        </NavLink>
                    </div>
                ))}
                    <Divider />
                    {SecondarylinksArray.map(({ icon, label, to }) => (
                    <div onClick={() => setClick(!click)} className="LinkContainer" key={label}>
                    <NavLink to={to} className="Links">
                        <div className="Linkicon">{icon}</div>
                        <span>{label}</span>
                    </NavLink>
                    </div>
                    ))}
                    <ToggleTema/>
                    <Divider />
                </Menu>
            </Navbar>
        </Container>
    )
}

const Container = styled.div`
    background-color: ${(props) => props.theme.body};
`

const Navbar = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
`

const HamburguerMenu = styled.span`
    position: fixed;
    top: 2rem;
    z-index: 100;

    .toggle {
    position: relative;
    width: 40px;
    cursor: pointer;
    margin: auto;
    display: block;
    height: calc(4px * 3 + 11px * 2);
        &.active {
            .bar--top {
            bottom: calc(50% - 11px - 4px);
            margin-bottom: calc(11px + 4px/ 2);
            transform: rotate(45deg);
            transition-delay: calc(0s + 0.35s * .3),calc(0s + 0.35s * 1.3),calc(0s + 0.35s * 1.3);
            }

            .bar--middle {
            top: calc(50% + 11px);
            opacity: 0;
            transition-duration: 0.35s,0s;
            transition-delay: 0s,calc(0s + 0.35s);
            }

            .bar--bottom {
            top: calc(50% - 4px/ 2);
            transform: rotate(-45deg);
            transition-delay: calc(0s + 0.35s * 1.3),calc(0s + 0.35s * 1.3);
            }
        }
    }

    .bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: calc(4px / 2);
    background: #7b52b9;
    color: inherit;
    opacity: 1;
    transition: none 0.35s cubic-bezier(.5,-0.35,.35,1.5) 0s;
    }

    .bar--top {
    bottom: calc(50% + 11px + 4px/ 2);
    transition-property: bottom,margin,transform;
    transition-delay: calc(0s + 0.35s),0s,0s;
    }

    .bar--middle {
    top: calc(50% - 4px/ 2);
    transition-property: top,opacity;
    transition-duration: 0.35s,0s;
    transition-delay: calc(0s + 0.35s * 1.3),calc(0s + 0.35s * 1.3);
    }

    .bar--bottom {
    top: calc(50% + 11px + 4px/ 2);
    transition-property: top,transform;
    transition-delay: 0s;
    }
`

const Menu = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    z-index: 10;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    background-color: ${(props) => `rgba(${props.theme.bodyRgba}, 0.85)`};
    backdrop-filter: blur(3px);
    transform: ${(props) => props.$click === "true" ? "translateY(0)" : "translateY(100%)"};
    transition: all 0.3s ease;
    .LinkContainer{
        .Links{
            width: 100vw;
            display: flex;
            align-items: center;
            text-decoration: none;
            color: ${(props) => props.theme.text};
            height: 80px;
            .Linkicon{
                padding: ${variable.smSpacing} ${variable.mdSpacing};
                display: flex;
                svg{
                    font-size: 25px;
                }
            }
        }
    }
`;

const Divider = styled.div`
  height: 3px;
  width: 100%;
  background: ${(props) => props.theme.bg4};
  margin: ${() => variable.lgSpacing} 0;
`;