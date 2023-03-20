import { useState, useRef, useEffect, MouseEvent, ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";

function matchPos(angle: number): string {
    if (angle >= -Math.PI && angle < -(Math.PI / 2)) {
        return "top-left";
    } else if (angle >= -(Math.PI / 2) && angle < 0) {
        return "top-right";
    } else if (angle >= 0 && angle < Math.PI / 2) {
        return "bottom-right";
    } else {
        return "bottom-left";
    }
}

function App() {
    const $canvas = useRef<HTMLCanvasElement>(null);
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
        angle: 0,
        radiusX: 100,
        radiusY: 50,
        ctx: null,
        earth: null,
        sun: null,
    });

    const [isDown, setIsDown] = useState(false);
    const $day = useRef<HTMLInputElement>(null);
    const [birthday, setBirthday] = useState<Dayjs>(dayjs());
    const [turn, setTurn] = useState(0);
    const [overHalf, setOverHalf] = useState(true);
    const [moveTrigger, setMoveTrigger] = useState("bottom-right");

    // function getValue(date:Dayjs) {
    //     const JANUARY_1 = new Date(date.getFullYear(), 0, 1);
    //     const JUNE_15 = new Date(date.getFullYear(), 5, 15);
    //     const DECEMBER_31 = new Date(date.getFullYear(), 11, 31);
    //     const valueRange = [-3.14, 3.14];

    //     if (date.getTime() === JANUARY_1.getTime()) {
    //         return valueRange[0];
    //     } else if (date.getTime() === JUNE_15.getTime()) {
    //         return 0;
    //     } else if (date.getTime() === DECEMBER_31.getTime()) {
    //         return valueRange[1];
    //     }

    //     const diffJanuary = date.getTime() - JANUARY_1.getTime();
    //     const diffDecember = DECEMBER_31.getTime() - date.getTime();
    //     const fullRange = valueRange[1] - valueRange[0];
    //     const halfRange = fullRange / 2;

    //     if (diffJanuary < JUNE_15.getTime() - JANUARY_1.getTime()) {
    //         const ratio =
    //             diffJanuary / (JUNE_15.getTime() - JANUARY_1.getTime());
    //         return (
    //             valueRange[0] +
    //             halfRange -
    //             halfRange * Math.cos(ratio * Math.PI)
    //         );
    //     } else {
    //         const ratio =
    //             (diffDecember - (DECEMBER_31.getTime() - JUNE_15.getTime())) /
    //             (DECEMBER_31.getTime() - JUNE_15.getTime());
    //         return (
    //             valueRange[1] -
    //             halfRange +
    //             halfRange * Math.cos(ratio * Math.PI)
    //         );
    //     }
    // }

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
            Math.PI * 2,
        );
        sliderConfig.ctx.stroke();

        const handleX = centerX + radiusX * Math.cos(angle);
        const handleY = centerY + radiusY * Math.sin(angle);

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

        if (overHalf) {
            if (angle > -Math.PI && angle < 0) {
                setOverHalf(false);
            }
        } else {
            if (angle > 0 && angle <= Math.PI) {
                setOverHalf(true);
            }
        }

        const pos = matchPos(angle);
        const nowBirthday = birthday;
        let dif = 0;

        if (moveTrigger === "top-left") {
            if (pos === "bottom-left") {
                setTurn((turn) => turn - 1);
                dif = -1;
            }
        } else if (moveTrigger === "bottom-left") {
            if (pos === "top-left") {
                setTurn((turn) => turn + 1);
                dif = 1;
            }
        }

        if (dif !== 0) {
            nowBirthday.add(dif, "year");
        }

        const firstDay = dayjs()
            .set("year", nowBirthday.get("year"))
            .set("month", 0)
            .set("date", 1);

        const diffDate = nowBirthday.diff(firstDay, "day");

        if (overHalf) {
            angle;
        }

        if (diffDate <= 182) {
        } else {
        }

        if (pos !== moveTrigger) {
            setMoveTrigger(pos);
        }
    }

    function handleMouseMove(event: MouseEvent<HTMLCanvasElement>) {
        if (isDown) {
            const dx = event.clientX - sliderConfig.centerX;
            const dy = event.clientY - sliderConfig.centerY;

            // console.log(Math.atan2(dy, dx));

            setSliderConfig((config) => ({
                ...config,
                angle: Math.atan2(dy, dx),
            }));

            // Draw the slider
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
    }

    useEffect(() => {
        if ($canvas.current || sliderConfig.ctx) {
            const { width, height } = $canvas.current;

            const earth = new Image();
            earth.src = "images/earth.png";

            const sun = new Image();
            sun.src = "images/sun.png";

            setSliderConfig((config) => ({
                ...config,
                centerX: width / 2,
                centerY: height / 2,
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
        if ($day.current) {
            $day.current.value = birthday.format("YYYY-MM-DD");
        }
    }, [birthday]);

    return (
        <div>
            <canvas
                id="slider"
                width="300"
                height="300"
                ref={$canvas}
                onMouseUp={() => setIsDown(false)}
                onMouseDown={() => setIsDown(true)}
                onMouseMove={handleMouseMove}
            ></canvas>
            <span>
                <br />
                너의 날짜는? &nbsp;
                <input
                    type="date"
                    defaultValue={birthday.format("YYYY-MM-DD")}
                    ref={$day}
                    onChange={handleChangeData}
                />
                {turn}
            </span>
        </div>
    );
}

export default App;
