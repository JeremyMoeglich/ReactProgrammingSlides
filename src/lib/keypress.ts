import { useEffect } from "react";
import { KeyboardEventKey } from "keyboard-event-key-type";
export function useListenKey(targetKey: KeyboardEventKey, callback: () => void) {
    useEffect(() => {
        const handler = ({ key }: { key: string }) => {
            if (key === targetKey) {
                callback();
            }
        };
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }
        , []);
}