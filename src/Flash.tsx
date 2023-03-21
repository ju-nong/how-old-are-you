import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const FlashContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -80;
    top: 0;
    left: 0;
`;

interface FlashOptions {
    delay: number;
    left: number;
    top: number;
}

const FlashStyled = styled.div<FlashOptions>`
    position: absolute;

    font-size: 1rem;
    transform: scale(0);

    animation-name: flash;
    animation-duration: 2s;

    ${(props) => css`
        top: ${props.top}%;
        left: ${props.left}%;
        animation-delay: ${props.delay}s;
    `}
`;

interface FlashProps {
    children: string;
}

type FlashType = {
    top: number;
    left: number;
    delay: number;
};

function Flash({ children }: FlashProps) {
    const [flashs, setFlashs] = useState<FlashType[]>([]);

    useEffect(() => {
        setInterval(() => {
            const newFlash: FlashType[] = [];

            for (let i = 0; i < 5; i++) {
                const top = Math.floor(Math.random() * 100);
                const left = Math.floor(Math.random() * 100);
                const delay = Math.floor(Math.random() * 2);
                newFlash.push({ top, left, delay });
            }

            setFlashs((flashs) => [...flashs, ...newFlash]);
        }, 1000);
    }, []);

    return (
        <FlashContainer>
            {flashs.map(({ top, left, delay }, index) => (
                <FlashStyled top={top} left={left} delay={delay} key={index}>
                    {children}
                </FlashStyled>
            ))}
        </FlashContainer>
    );
}

export { Flash as default };
