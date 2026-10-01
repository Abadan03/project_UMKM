import React from "react";
import styled from "styled-components";

export function CardGlassEffect() {
    return (
        <StyledWrapper>
            <div className="container">
                <div className="card">
                    <p className="desc">
                        <span className="innerText">Welcome</span> To Salesgear
                        SaaS Dashboard, Your Ultimate Solution For Streamlined
                        Sales Management. Whether You're A Small Business Or A
                        Large Enterprise, Our Platform Empowers You To Take
                        Control Of Your Sales Processes With Ease.
                    </p>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    .container {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 0;
        border-radius: 10px;
        background: linear-gradient(
            135deg,
            #1a0a2e 0%,
            #2e1044 60%,
            #3c2060 100%
        );
    }
    .container::after {
        content: " ";
        position: absolute;
        height: 150px;
        width: 150px;
        left: 50%;
        top: 25%;
        transform: translate(-100%, 100%);
        background-image: linear-gradient(#ff8800, #5a3888);
        border-radius: 50%;
        z-index: -1;
        border: 2px solid #ddc8f0a6;
        box-shadow: inset 10px 0px 20px #8860b050;
        animation: ani 28s ease-in-out infinite;
    }
    .container::before {
        content: " ";
        position: absolute;
        height: 80px;
        width: 80px;
        left: 46%;
        bottom: 25%;
        transform: translateX(-100%);
        background-image: linear-gradient(90deg, #44ddff, #8860b0);
        border-radius: 50%;
        z-index: -1;
        border: 2px solid #ddc8f0a6;
        box-shadow: inset 10px 0px 20px #44ddff40;
    }
    .card {
        border: 1px solid #8860b056;
        border-radius: 10px;
        backdrop-filter: blur(10.5px);
        padding: 10px;
        position: relative;
        box-shadow: inset 2px 1px 6px #ddc8f030;
        overflow: hidden;
        z-index: 0;
    }
    .card::after {
        z-index: -1;
        content: " ";
        position: absolute;
        width: 150%;
        top: 0;
        left: 0;
        height: 10px;
        background: linear-gradient(90deg, #ff8800, #5a3888, #44ddff);
        transform: rotateZ(50deg);
        filter: blur(30px);
        animation: shine 10s ease infinite;
    }
    .innerText {
        background-image: linear-gradient(
            135deg,
            #ff8800 0%,
            #ffdd00 60%,
            #ffe8a0 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        filter: drop-shadow(0 0 8px rgba(255, 136, 0, 0.7));
        font-size: 36px;
        font-weight: 800;
        line-height: 1em;
        margin: 10px 0px;
    }
    .desc {
        padding: 4px;
        color: #ddc8f0;
    }

    @keyframes ani {
        0% {
            transform: translateX(0%) scale(1);
        }
        50% {
            transform: translateX(-100%) scale(0.8);
        }
        100% {
            transform: translateX(0%) scale(1);
        }
    }

    @keyframes shine {
        0% {
            top: 100%;
            left: -100%;
        }
        50%,
        100% {
            top: 0%;
            left: 70%;
        }
    }
`;
