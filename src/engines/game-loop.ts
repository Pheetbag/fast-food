export type IterationStepCallback = (delta: number) => void;

/**
 * GameLoop engine to handle the main loop of the game.
 * It manages update and draw steps separately to ensure consistent updates.
 *
 * This engine is only responsible for keeping the loop running. The actual game logic
 * should be handled in the update and draw steps added to the loop.
 *
 * @see https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing for
 * the source of this implementation.
 */
export class GameLoop {
    private updateSteps: IterationStepCallback[] = [];
    private drawSteps: IterationStepCallback[] = [];

    private isEnabled: boolean = false;
    private lastFrameTimestamp: number = 0;
    private maxFPS: number = 60;
    private delta: number = 0;
    private currentFrameId: number | null = null;

    // FPS tracking
    fps: number = 60;
    private framesThisSecond: number = 0;
    private lastFpsUpdate: number = 0;

    private runIteration(timestamp: number): void {
        if (!this.isEnabled) {
            return;
        }

        // Throttle the frame rate to cap it at maxFPS.
        // That save us resources as we don't need to simulate it further.
        if (timestamp < this.lastFrameTimestamp + 1000 / this.maxFPS) {
            this.currentFrameId = requestAnimationFrame(
                this.runIteration.bind(this),
            );
            return;
        }

        this.trackFps(timestamp);

        const deltaStep = 1000 / this.maxFPS;

        this.delta += timestamp - this.lastFrameTimestamp;
        this.lastFrameTimestamp = timestamp;

        let numUpdateSteps = 0;

        while (this.delta >= deltaStep) {
            this.updateSteps.forEach((step) => {
                step(deltaStep);
                this.delta -= deltaStep;
            });

            // Prevent spiral of death if
            if (++numUpdateSteps >= 240) {
                this.delta = 0;
                break;
            }
        }

        this.drawSteps.forEach((step) => {
            step(this.delta);
        });

        this.currentFrameId = requestAnimationFrame(
            this.runIteration.bind(this),
        );
    }

    private trackFps(timestamp: number): void {
        if (timestamp > this.lastFpsUpdate + 1000) {
            // update every second
            this.fps = 0.25 * this.framesThisSecond + (1 - 0.25) * this.fps; // compute the new FPS

            this.lastFpsUpdate = timestamp;
            this.framesThisSecond = 0;
        }
        this.framesThisSecond++;
    }

    start(): void {
        this.pause();
        this.isEnabled = true;

        this.runIteration(0);
    }

    pause(): void {
        this.isEnabled = false;
        if (this.currentFrameId !== null) {
            cancelAnimationFrame(this.currentFrameId);
            this.currentFrameId = null;
        }
    }

    addUpdateStep(step: IterationStepCallback): void {
        this.updateSteps.push(step);
    }

    addDrawStep(step: IterationStepCallback): void {
        this.drawSteps.push(step);
    }
}

export const gameLoop = new GameLoop();
