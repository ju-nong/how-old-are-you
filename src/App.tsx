import { useState, useRef, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import styled from "@emotion/styled";
import BirthdayPicker from "./BirthdayPicker";

function App() {
    return (
        <div>
            <BirthdayPicker></BirthdayPicker>
        </div>
    );
}

export default App;
