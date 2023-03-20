import { useState, useRef, useEffect, MouseEvent } from "react";

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

    function drawSlider() {
        if (!sliderConfig.ctx || !$canvas.current) {
            return;
        }

        sliderConfig.ctx.clearRect(
            0,
            0,
            $canvas.current.width,
            $canvas.current.height,
        );

        // Draw the ellipse
        sliderConfig.ctx.beginPath();
        sliderConfig.ctx.ellipse(
            sliderConfig.centerX,
            sliderConfig.centerY,
            sliderConfig.radiusX,
            sliderConfig.radiusY,
            0,
            0,
            Math.PI * 2,
        );
        sliderConfig.ctx.stroke();

        // Calculate the position of the slider handle
        const handleX =
            sliderConfig.centerX +
            sliderConfig.radiusX * Math.cos(sliderConfig.angle);
        const handleY =
            sliderConfig.centerY +
            sliderConfig.radiusY * Math.sin(sliderConfig.angle);

        // Draw the handle

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
                sliderConfig.centerX - 25,
                sliderConfig.centerY - 25,
                50,
                50,
            );
        }
    }

    function handleMouseMove(event: MouseEvent<HTMLCanvasElement>) {
        if (isDown) {
            const dx = event.clientX - sliderConfig.centerX;
            const dy = event.clientY - sliderConfig.centerY;

            setSliderConfig((config) => ({
                ...config,
                angle: Math.atan2(dy, dx),
            }));

            // Draw the slider
            drawSlider();
        }
    }

    useEffect(() => {
        if ($canvas.current) {
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

            drawSlider();
        }
    }, [$canvas]);

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
        </div>
    );
}

export default App;
