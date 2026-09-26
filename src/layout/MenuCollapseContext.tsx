import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const STORAGE_KEY = "lurevia-admin-menu-collapsed";

export const RAIL_WIDTH = 72;
export const EXPANDED_WIDTH = 240;

interface MenuCollapseContextValue {
    collapsed: boolean;
    toggle: () => void;
    setCollapsed: (value: boolean) => void;
    width: number;
    isMobile: boolean;
}

const MenuCollapseContext = createContext<MenuCollapseContextValue | null>(null);

export function MenuCollapseProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsedState] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem(STORAGE_KEY) === "true";
    });

    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < 900;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        const checkMobile = () => setIsMobile(window.innerWidth < 900);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, String(collapsed));
        }
    }, [collapsed]);

    const setCollapsed = useCallback((value: boolean) => {
        setCollapsedState(value);
    }, []);

    const toggle = useCallback(() => {
        setCollapsedState((prev) => !prev);
    }, []);

    const effectiveCollapsed = isMobile ? false : collapsed;
    const width = effectiveCollapsed ? RAIL_WIDTH : EXPANDED_WIDTH;

    const value = useMemo(
        () => ({
            collapsed: effectiveCollapsed,
            toggle,
            setCollapsed,
            width,
            isMobile,
        }),
        [effectiveCollapsed, toggle, setCollapsed, width, isMobile]
    );

    return (
        <MenuCollapseContext.Provider value={value}>
            {children}
        </MenuCollapseContext.Provider>
    );
}

export function useMenuCollapse(): MenuCollapseContextValue {
    const ctx = useContext(MenuCollapseContext);
    if (!ctx) {
        throw new Error("useMenuCollapse doit être utilisé dans <MenuCollapseProvider>.");
    }
    return ctx;
}