import { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import BirthdayPicker from "./BirthdayPicker";
import Flash from "./Flash";

const MainContainer = styled.div`
    position: relative;

    width: 100%;
    height: 100%;
`;

function App() {
    const [isDown, setIsDown] = useState(false);

    function handleIsDown(down: boolean) {
        setIsDown(down);
    }

    return (
        <MainContainer>
            <BirthdayPicker onIsDown={handleIsDown}></BirthdayPicker>
            {/* <span>🚀</span>
            <span>🌠</span>
            <span>⭐</span> */}
            {isDown && <Flash>✨</Flash>}
        </MainContainer>
    );
}

export default App;
