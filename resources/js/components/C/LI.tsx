import React from 'react'
import styled from 'styled-components';

export default function LI() {
  return (
    <StyledWrapper>
      <div className="book">
        <div className="page">
          <p className="page-text">HELLO</p>
          <p className="page-sub">PRESS START</p>
        </div>
        <div className="cover">
          <div className="cover-inner">
            <p className="cover-title">LOGIN</p>
            <p className="cover-sub">&gt; CLICK ME &lt;</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;

  .book {
    position: relative;
    width: 100px;
    height: 60px;
    perspective: 400px;
    image-rendering: pixelated;
  }

  .page {
    position: absolute;
    inset: 0;
    background: #ffdd00;
    border: 4px solid #1a0a2e;
    box-shadow:
      4px 4px 0 #1a0a2e,
      inset 0 0 0 4px #ff8800;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .page-text {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #1a0a2e;
    text-shadow: 2px 2px 0 #ff8800;
  }

  .page-sub {
    margin: 0;
    font-size: 8px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #884400;
    animation: blink 1s steps(2) infinite;
  }

  .cover {
    position: absolute;
    inset: 0;
    background: #5a3888;
    border: 4px solid #1a0a2e;
    box-shadow:
      4px 4px 0 #1a0a2e,
      inset 0 0 0 4px #8860b0,
      inset -8px -8px 0 0 #3c2060;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: left center;
    transition: transform 0.45s steps(6);
  }

  .cover-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .cover-title {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #ffffff;
    text-shadow: 2px 2px 0 #2e1044;
  }

  .cover-sub {
    margin: 0;
    font-size: 8px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #ddc8f0;
  }

  .book:hover .cover {
    transform: rotateY(-110deg);
    box-shadow:
      -4px 4px 0 #1a0a2e,
      inset 0 0 0 4px #8860b0;
  }

  @keyframes blink {
    to {
      opacity: 0;
    }
  }
`;