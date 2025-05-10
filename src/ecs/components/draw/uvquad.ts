import { DEF_ANCHOR, UV_PAD } from "../../../constants";
import { getRenderProps } from "../../../game/utils";
import { anchorPt } from "../../../gfx/anchor";
import { drawRaw } from "../../../gfx/draw/drawRaw";
import { multRotate, multScaleV, multTranslate, multTranslateV, popTransform, pushTransform } from "../../../gfx/stack";
import { Color } from "../../../math/color";
import { Quad, Rect, vec2 } from "../../../math/math";
import { BlendMode, type Comp, type DrawUVQuadOpt, type GameObj } from "../../../types";

/**
 * The {@link uvquad `uvquad()`} component.
 *
 * @group Component Types
 */
export interface UVQuadComp extends Comp {
    draw: Comp["draw"];
    /**
     * Width of rect.
     */
    width: number;
    /**
     * Height of height.
     */
    height: number;
    /**
     * @since v3000.0
     */
    renderArea(): Rect;
}
export function uvquad(w: number, h: number): UVQuadComp {
    return {
        id: "rect",
        width: w,
        height: h,
        draw(this: GameObj<UVQuadComp>) {
            drawUVQuad(Object.assign(getRenderProps(this), {
                width: this.width,
                height: this.height,
            }));
        },
        renderArea() {
            return new Rect(vec2(0), this.width, this.height);
        },
        inspect() {
            return `uvquad: (${Math.ceil(this.width)}w, ${
                Math.ceil(this.height)
            })h`;
        },
    };
}

// NB. Copied in from master branch, uvquad is bricked in alpha 18
export function drawUVQuad(opt: DrawUVQuadOpt) {
    if (opt.width === undefined || opt.height === undefined) {
        throw new Error(
            "drawUVQuad() requires property \"width\" and \"height\".",
        );
    }

    if (opt.width <= 0 || opt.height <= 0) {
        return;
    }

    const w = opt.width;
    const h = opt.height;
    const anchor = anchorPt(opt.anchor || DEF_ANCHOR);
    const offsetX = anchor.x * w * -0.5;
    const offsetY = anchor.y * h * -0.5;
    const q = opt.quad || new Quad(0, 0, 1, 1);
    const color = opt.color || Color.WHITE;
    const opacity = opt.opacity ?? 1;

    // apply uv padding to avoid artifacts
    const uvPadX = opt.tex ? UV_PAD / opt.tex.width : 0;
    const uvPadY = opt.tex ? UV_PAD / opt.tex.height : 0;
    const qx = q.x + uvPadX;
    const qy = q.y + uvPadY;
    const qw = q.w - uvPadX * 2;
    const qh = q.h - uvPadY * 2;

    pushTransform();
    multTranslateV(opt.pos);
    multRotate(opt.angle);
    multScaleV(opt.scale);
    multTranslate(offsetX, offsetY);

    drawRaw(
        {
            pos: [
                -w / 2,
                h / 2,
                -w / 2,
                -h / 2,
                w / 2,
                -h / 2,
                w / 2,
                h / 2,
            ],
            uv: [
                opt.flipX ? qx + qw : qx,
                opt.flipY ? qy : qy + qh,
                opt.flipX ? qx + qw : qx,
                opt.flipY ? qy + qh : qy,
                opt.flipX ? qx : qx + qw,
                opt.flipY ? qy + qh : qy,
                opt.flipX ? qx : qx + qw,
                opt.flipY ? qy : qy + qh,
            ],
            color: [
                color.r,
                color.g,
                color.b,
                color.r,
                color.g,
                color.b,
                color.r,
                color.g,
                color.b,
                color.r,
                color.g,
                color.b,
            ],
            opacity: [
                opacity,
                opacity,
                opacity,
                opacity,
            ],
        },
        [0, 1, 3, 1, 2, 3],
        opt.fixed,
        opt.tex,
        opt.shader,
        opt.uniform ?? undefined,
        opt.blend ?? BlendMode.Normal,
    );

    popTransform();
}
