import type { GameObj } from "../types";

// Note: I will doom this soon 😈😈😈😈
export function getRenderProps(obj: GameObj<any>) {
    return {
        color: obj.color,
        opacity: obj.opacity,
        anchor: obj.anchor,
        outline: obj.outline,
        shader: obj.shader,
        uniform: obj.uniform,
        blend: obj.blend,
        // TODO: double check when to convert to array
        custom: [
            obj.customA?.x ?? 0,
            obj.customA?.y ?? 0,
            obj.customB?.x ?? 0,
            obj.customB?.y ?? 0,
        ] as [number, number, number, number],
        customA: obj.customA,
        customB: obj.customB,
    };
}
