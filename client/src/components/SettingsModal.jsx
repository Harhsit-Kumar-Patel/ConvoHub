import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.jsx';
import { useTheme } from '@/components/ThemeProvider.jsx';

export default function SettingsModal() {
  const { settings, setFontScale, setHighContrast } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Open settings">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appearance Settings</DialogTitle>
          <DialogDescription>Customize typography and contrast to suit your preference.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="appearance">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Font size</label>
              <input
                type="range"
                min="0.875"
                max="1.25"
                step="0.125"
                value={settings.fontScale}
                onChange={(e) => setFontScale(parseFloat(e.target.value))}
                className="w-full"
                aria-label="Font size"
              />
              <p className="text-xs text-muted-foreground mt-1">Current scale: {settings.fontScale}x</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="high-contrast"
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="high-contrast" className="text-sm">High contrast</label>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
