import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemeName = 'dark' | 'light' | 'high-contrast-dark' | 'high-contrast-light' | 'dyslexia' | 'colorblind-deut' | 'colorblind-prot' | 'low-vision';

interface ThemeConfig {
    theme: ThemeName;
    fontSize: number;
    lineSpacing: number;
    reduceMotion: boolean;
    screenReaderMode: boolean;
}

interface ThemeContextType {
    config: ThemeConfig;
    setTheme: (theme: ThemeName) => void;
    setFontSize: (size: number) => void;
    setLineSpacing: (spacing: number) => void;
    setReduceMotion: (reduce: boolean) => void;
    setScreenReaderMode: (mode: boolean) => void;
    themes: { id: ThemeName; name: string; description: string }[];
}

const defaultConfig: ThemeConfig = {
    theme: 'dark', fontSize: 16, lineSpacing: 1.6, reduceMotion: false, screenReaderMode: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes: { id: ThemeName; name: string; description: string }[] = [
    { id: 'dark', name: 'Cosmic Dark', description: 'Deep navy with purple accents' },
    { id: 'light', name: 'Clean Light', description: 'Bright and minimal' },
    { id: 'high-contrast-dark', name: 'High Contrast Dark', description: 'Maximum contrast on dark background' },
    { id: 'high-contrast-light', name: 'High Contrast Light', description: 'Maximum contrast on light background' },
    { id: 'dyslexia', name: 'Dyslexia Friendly', description: 'Warm tones, increased spacing' },
    { id: 'colorblind-deut', name: 'Colorblind (Deuteranopia)', description: 'Blue-orange safe palette' },
    { id: 'colorblind-prot', name: 'Colorblind (Protanopia)', description: 'Blue-yellow safe palette' },
    { id: 'low-vision', name: 'Low Vision', description: 'Large text, bold outlines' },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ThemeConfig>(() => {
        const saved = localStorage.getItem('inclusiveLMS_theme');
        return saved ? JSON.parse(saved) : defaultConfig;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', config.theme);
        document.documentElement.style.fontSize = `${config.fontSize}px`;
        document.documentElement.style.lineHeight = String(config.lineSpacing);
        document.documentElement.setAttribute('data-reduce-motion', String(config.reduceMotion));
        localStorage.setItem('inclusiveLMS_theme', JSON.stringify(config));
    }, [config]);

    const setTheme = (theme: ThemeName) => setConfig(prev => ({ ...prev, theme }));
    const setFontSize = (fontSize: number) => setConfig(prev => ({ ...prev, fontSize }));
    const setLineSpacing = (lineSpacing: number) => setConfig(prev => ({ ...prev, lineSpacing }));
    const setReduceMotion = (reduceMotion: boolean) => setConfig(prev => ({ ...prev, reduceMotion }));
    const setScreenReaderMode = (screenReaderMode: boolean) => setConfig(prev => ({ ...prev, screenReaderMode }));

    return (
        <ThemeContext.Provider value={{ config, setTheme, setFontSize, setLineSpacing, setReduceMotion, setScreenReaderMode, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
