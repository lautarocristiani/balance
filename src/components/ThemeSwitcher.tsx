'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderiza un placeholder para evitar 'hydration mismatch'
    // y mantener el espacio del botón en el layout.
    return <div className="h-10 w-10 rounded-md border" />;
  }

  const isDarkMode = theme === 'dark';

  return (
    <Button
      variant="theme"
      size="icon"
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
    >
      {/* SOL: Se muestra solo si isDarkMode es true (en modo oscuro) */}
      <Sun className={`h-5 w-5 transition-all duration-300 ${isDarkMode ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
      
      {/* LUNA: Se muestra solo si isDarkMode es false (en modo claro) */}
      <Moon className={`absolute h-5 w-5 transition-all duration-300 ${isDarkMode ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};