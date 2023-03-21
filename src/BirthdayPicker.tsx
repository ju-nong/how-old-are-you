import { useState, useRef, useEffect, MouseEvent, ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import styled from "@emotion/styled";

dayjs.extend(dayOfYear);

const PI = Math.PI;

function matchPos(angle: number): string {
    if (angle >= -PI && angle <= -(PI / 2)) {
        return "top-left";
    } else if (angle >= -(PI / 2) && angle < 0) {
        return "top-right";
    } else if (angle >= 0 && angle < PI / 2) {
        return "bottom-right";
    } else {
        return "bottom-left";
    }
}

function mathAngleOfDate(date: number): number {
    const percentage = (date - 1) / 364;
    const value = percentage * (PI * 2) - PI;

    return value;
}

function mathDateOfAngle(angle: number): number {
    return Math.floor(((angle + PI) / (PI * 2)) * 363) + 1;
}

const PickerContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    position: relative;
    overflow: hidden;

    & > div {
        display: flex;
        flex-direction: column;
        align-items: center;

        & > h3 {
            position: relative;
            transition: color 0.3s;

            &::before {
                content: "지구를 움직여보세요!";
                position: absolute;
                bottom: 0;
                right: 0;
                transform: translateX(110%);
                color: #999;
                font-size: 0.75rem;
            }
        }

        & > span {
            & > input {
                background-color: transparent;
                transition: color 0.3s;
            }
        }

        canvas {
            cursor: pointer;
        }
    }

    & > img {
        position: absolute;
        object-fit: cover;
        z-index: -100;
        transition: opacity 0.3s;
        opacity: 0;
    }

    &.show {
        & > div {
            & > h3 {
                color: #fff;
            }

            & > span {
                & > input {
                    color: #fff;
                }
            }
        }

        & > img {
            opacity: 1;
        }
    }
`;

interface PickerProps {
    onIsDown: (down: boolean) => void;
}

function BirthdayPicker({ onIsDown }: PickerProps) {
    const $input = useRef<HTMLInputElement>(null);
    const [birthday, setBirthday] = useState<Dayjs>(dayjs());

    const $canvas = useRef<HTMLCanvasElement>(null);
    const canvasSize = {
        width: 300,
        height: 300,
    };
    const [isDown, setIsDown] = useState(false);

    const [sliderConfig, setSliderConfig] = useState<{
        centerX: number;
        centerY: number;
        angle: number;
        radiusX: number;
        radiusY: number;
        ctx: CanvasRenderingContext2D | null | undefined;
        earth: HTMLImageElement | null;
        sun: HTMLImageElement | null;
    }>({
        centerX: 0,
        centerY: 0,
        angle: mathAngleOfDate(birthday.dayOfYear()),
        radiusX: 100,
        radiusY: 50,
        ctx: null,
        earth: null,
        sun: null,
    });

    const [overHalf, setOverHalf] = useState(true);

    const [moveTrigger, setMoveTrigger] = useState("bottom-right");

    function drawSlider() {
        if (!sliderConfig.ctx || !$canvas.current) {
            return;
        }

        const { centerX, centerY, radiusX, radiusY, angle } = sliderConfig;

        sliderConfig.ctx.clearRect(
            0,
            0,
            $canvas.current.width,
            $canvas.current.height,
        );

        sliderConfig.ctx.beginPath();
        sliderConfig.ctx.ellipse(
            centerX,
            centerY,
            radiusX,
            radiusY,
            0,
            0,
            PI * 2,
        );
        sliderConfig.ctx.strokeStyle = "#fff";
        sliderConfig.ctx.stroke();

        const handleX = centerX + radiusX * Math.cos(angle);
        const handleY = centerY + radiusY * Math.sin(angle);

        // 지구 및 태양 그려주는 거
        if (sliderConfig.earth && sliderConfig.sun) {
            sliderConfig.ctx.drawImage(
                sliderConfig.earth,
                handleX - 10,
                handleY - 10,
                20,
                20,
            );

            sliderConfig.ctx.drawImage(
                sliderConfig.sun,
                centerX - 25,
                centerY - 25,
                50,
                50,
            );
        }

        // 반을 넘었는지 안 넘었는지
        if (overHalf) {
            if (angle > -PI && angle < 0) {
                setOverHalf(false);
            }
        } else {
            if (angle > 0 && angle <= PI) {
                setOverHalf(true);
            }
        }

        const pos = matchPos(angle);
        let dif = 0;

        if (moveTrigger === "top-left" && pos === "bottom-left") {
            dif = -1;
        } else if (moveTrigger === "bottom-left" && pos === "top-left") {
            dif = 1;
        }

        const nowBirthday = birthday
            .clone()
            .add(dif, "year")
            .set("month", 0)
            .set("date", 1)
            .add(mathDateOfAngle(angle), "day");

        setBirthday(
            birthday
                .set("year", nowBirthday.get("year"))
                .set("month", nowBirthday.get("month"))
                .set("date", nowBirthday.get("date")),
        );

        // 구역이 바뀌었는지
        if (pos !== moveTrigger) {
            setMoveTrigger(pos);
        }
    }

    function handleMouseMove(event: MouseEvent<HTMLCanvasElement>) {
        if (isDown) {
            const { offsetX, offsetY } = event.nativeEvent;

            const dx = offsetX - sliderConfig.centerX;
            const dy = offsetY - sliderConfig.centerY;

            setSliderConfig((config) => ({
                ...config,
                angle: Math.atan2(dy, dx),
            }));

            drawSlider();
        }
    }

    function handleChangeData(event: ChangeEvent<HTMLInputElement>) {
        const changeDate = dayjs(event.target.value);

        setBirthday((birthday) =>
            birthday
                .set("year", changeDate.get("year"))
                .set("month", changeDate.get("month"))
                .set("date", changeDate.get("date")),
        );

        setSliderConfig((sliderConfig) => ({
            ...sliderConfig,
            angle: mathAngleOfDate(changeDate.dayOfYear()),
        }));

        drawSlider();
    }

    useEffect(() => {
        if ($canvas.current || sliderConfig.ctx) {
            const earth = new Image();
            earth.src = "images/earth.png";

            const sun = new Image();
            sun.src = "images/sun.png";

            setSliderConfig((config) => ({
                ...config,
                centerX: canvasSize.width / 2,
                centerY: canvasSize.height / 2,
                ctx: $canvas.current?.getContext("2d"),
                earth,
                sun,
            }));

            setTimeout(() => {
                drawSlider();
            }, 1000);
        }
    }, [$canvas, sliderConfig.ctx]);

    useEffect(() => {
        if ($input.current) {
            $input.current.value = birthday.format("YYYY-MM-DD");
        }
    }, [birthday]);

    const [spaceShow, setSpaceShow] = useState(false);

    useEffect(() => {
        setSpaceShow(isDown);
        onIsDown(isDown);
    }, [isDown]);

    return (
        <PickerContainer className={`${spaceShow ? "show" : ""}`}>
            <div>
                <h3>오 생일이 어떻게 되세요?</h3>
                <span>
                    <input
                        type="date"
                        defaultValue={birthday.format("YYYY-MM-DD")}
                        ref={$input}
                        onChange={handleChangeData}
                    />
                </span>
                <canvas
                    width={canvasSize.width}
                    height={canvasSize.height}
                    ref={$canvas}
                    onMouseUp={() => setIsDown(false)}
                    onMouseDown={() => setIsDown(true)}
                    onMouseMove={handleMouseMove}
                ></canvas>
            </div>
            <img src="images/space.jpg" />
        </PickerContainer>
    );
}

export { BirthdayPicker as default };
