import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

const FlashContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -80;
    top: 0;
    left: 0;

    & > div {
        position: absolute;

        font-size: 1rem;
        transform: scale(0);

        animation-name: flash;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-delay: 1s;
    }
`;

interface FlashProps {
    children: string;
}

function Flash({ children }: FlashProps) {
    const [stars, setStars] = useState([1, 2, 3]);

    // useEffect(() => {
    //     setInterval(() => {

    //     }, 3000)
    // }, [])

    return (
        <FlashContainer>
            {stars.map((_) => (
                <div>{children}</div>
            ))}
        </FlashContainer>
    );
}

export { Flash as default };
