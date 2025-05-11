import type { GameObj } from "../types";

export function isFixed(obj: GameObj): boolean {
    if (obj.fixed) return true;
    return obj.parent ? isFixed(obj.parent) : false;
}

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
