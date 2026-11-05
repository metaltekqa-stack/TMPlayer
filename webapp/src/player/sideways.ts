// Landscape on an iPhone without the phone turning the screen. A page cannot lock the orientation
// there (no screen.orientation.lock, in Safari or from the Home Screen), so with the phone's
// rotation lock on, the player turns itself: the whole player a quarter turn by CSS while the
// window stays upright (player.css, .player.sideways). Touches still arrive in the window's
// coordinates, so everything that reads a position (the gestures, the timebar) goes through
// [point] and [box], which answer in the player's own, turned coordinates.
import { createSignal } from 'solid-js'

const KEY = 'player:sideways'

function stored(): boolean {
    try {
        return localStorage.getItem(KEY) === '1'
    } catch {
        return false
    }
}

const [wanted, setWantedNow] = createSignal(stored())

/** The viewer's choice, kept for the next video: wide videos turned sideways while the window is upright. */
export { wanted }

export function setWanted(on: boolean) {
    setWantedNow(on)
    try {
        if (on) localStorage.setItem(KEY, '1')
        else localStorage.removeItem(KEY)
    } catch {}
}

/** The player is drawn turned right now; Chrome sets it from [wanted], the window and the video's shape. */
export const [sideways, setSideways] = createSignal(false)

export interface Box {
    left: number
    top: number
    right: number
    bottom: number
    width: number
    height: number
}

/**
 * A point of the window in the player's coordinates. Turned a quarter clockwise, the player's
 * origin is the window's top right corner, its x runs down the window and its y runs leftwards.
 */
export function point(clientX: number, clientY: number): { x: number; y: number } {
    return sideways() ? { x: clientY, y: innerWidth - clientX } : { x: clientX, y: clientY }
}

/** An element's box in the player's coordinates (see [point]). */
export function box(el: Element): Box {
    const r = el.getBoundingClientRect()
    if (!sideways()) return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }
    return { left: r.top, top: innerWidth - r.right, right: r.bottom, bottom: innerWidth - r.left, width: r.height, height: r.width }
}
