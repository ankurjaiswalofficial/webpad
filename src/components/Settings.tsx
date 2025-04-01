import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface SettingsProps {
  autoSaveToDevice: boolean;
  onAutoSaveToDeviceChange: (enabled: boolean) => void;
}

export function Settings({ autoSaveToDevice, onAutoSaveToDeviceChange }: Readonly<SettingsProps>) {
  return (
    <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">Settings</h2>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <Label htmlFor="auto-save-device" className="text-sm cursor-pointer">Auto-save to device</Label>
          <Switch
            id="auto-save-device"
            checked={autoSaveToDevice}
            onCheckedChange={onAutoSaveToDeviceChange}
          />
        </div>
      </div>
    </div>
  );
}
