// src/lib/utils.ts

/**
 * Conditionally join classNames together.
 */
export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}
