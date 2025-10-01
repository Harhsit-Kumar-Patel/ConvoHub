import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useTheme } from './ThemeProvider.jsx';

export default function ThemeToggle({ className }) {
  const { settings, setTheme, toggleTheme } = useTheme();

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          title="Toggle theme"
          onClick={toggleTheme}
        >
          {/* sun/moon icon */}
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </Button>
        <select
          aria-label="Theme mode"
          className="bg-transparent text-sm border border-input rounded-md px-2 py-1 hover:bg-accent hover:text-accent-foreground"
          value={settings.theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    </div>
  );
}
