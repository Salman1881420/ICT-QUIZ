'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Monitor, Volume2, Globe, Bell, Shield, Download, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SettingsState {
  // Playback Settings
  autoPlay: boolean;
  autoPlayNext: boolean;
  skipIntro: boolean;
  defaultQuality: string;
  playbackSpeed: string;
  subtitleLanguage: string;
  audioLanguage: string;
  
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  language: string;
  
  // Notifications
  episodeNotifications: boolean;
  newSeasonNotifications: boolean;
  communityNotifications: boolean;
  emailNotifications: boolean;
  
  // Privacy
  showWatchHistory: boolean;
  showWatchlist: boolean;
  analyticsOptOut: boolean;
  
  // Advanced
  enableDownloads: boolean;
  downloadQuality: string;
  autoDeleteDownloads: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    // Playback Settings
    autoPlay: true,
    autoPlayNext: true,
    skipIntro: false,
    defaultQuality: 'auto',
    playbackSpeed: '1.0',
    subtitleLanguage: 'english',
    audioLanguage: 'japanese',
    
    // Appearance
    theme: 'auto',
    language: 'english',
    
    // Notifications
    episodeNotifications: true,
    newSeasonNotifications: true,
    communityNotifications: false,
    emailNotifications: false,
    
    // Privacy
    showWatchHistory: true,
    showWatchlist: true,
    analyticsOptOut: false,
    
    // Advanced
    enableDownloads: true,
    downloadQuality: '1080p',
    autoDeleteDownloads: true,
  });

  const [activeTab, setActiveTab] = useState('playback');

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'playback', label: 'Playback', icon: Monitor },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  const ToggleSwitch = ({ checked, onChange, label, description }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-600 mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked ? 'bg-primary-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SelectField = ({ value, onChange, options, label, description }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label: string;
    description?: string;
  }) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="font-medium text-gray-900 mb-2">{label}</div>
      {description && (
        <div className="text-sm text-gray-600 mb-3">{description}</div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary-600" />
            Settings
          </h1>
          <p className="text-gray-600">
            Customize your viewing experience and account preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'playback' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Playback Settings
                  </h2>

                  <ToggleSwitch
                    checked={settings.autoPlay}
                    onChange={(checked) => updateSetting('autoPlay', checked)}
                    label="Auto-play episodes"
                    description="Automatically start playing episodes when you visit the page"
                  />

                  <ToggleSwitch
                    checked={settings.autoPlayNext}
                    onChange={(checked) => updateSetting('autoPlayNext', checked)}
                    label="Auto-play next episode"
                    description="Automatically play the next episode when current episode ends"
                  />

                  <ToggleSwitch
                    checked={settings.skipIntro}
                    onChange={(checked) => updateSetting('skipIntro', checked)}
                    label="Skip intro automatically"
                    description="Skip opening sequences when detected"
                  />

                  <SelectField
                    value={settings.defaultQuality}
                    onChange={(value) => updateSetting('defaultQuality', value)}
                    label="Default video quality"
                    description="Preferred video quality for playback"
                    options={[
                      { value: 'auto', label: 'Auto (recommended)' },
                      { value: '1080p', label: '1080p Full HD' },
                      { value: '720p', label: '720p HD' },
                      { value: '480p', label: '480p' },
                      { value: '360p', label: '360p' },
                    ]}
                  />

                  <SelectField
                    value={settings.playbackSpeed}
                    onChange={(value) => updateSetting('playbackSpeed', value)}
                    label="Default playback speed"
                    options={[
                      { value: '0.5', label: '0.5x' },
                      { value: '0.75', label: '0.75x' },
                      { value: '1.0', label: '1x (Normal)' },
                      { value: '1.25', label: '1.25x' },
                      { value: '1.5', label: '1.5x' },
                      { value: '2.0', label: '2x' },
                    ]}
                  />

                  <SelectField
                    value={settings.subtitleLanguage}
                    onChange={(value) => updateSetting('subtitleLanguage', value)}
                    label="Preferred subtitle language"
                    options={[
                      { value: 'english', label: 'English' },
                      { value: 'japanese', label: 'Japanese' },
                      { value: 'spanish', label: 'Spanish' },
                      { value: 'french', label: 'French' },
                      { value: 'german', label: 'German' },
                      { value: 'none', label: 'None' },
                    ]}
                  />

                  <SelectField
                    value={settings.audioLanguage}
                    onChange={(value) => updateSetting('audioLanguage', value)}
                    label="Preferred audio language"
                    options={[
                      { value: 'japanese', label: 'Japanese (Original)' },
                      { value: 'english', label: 'English (Dubbed)' },
                    ]}
                  />
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Appearance
                  </h2>

                  <SelectField
                    value={settings.theme}
                    onChange={(value) => updateSetting('theme', value as 'light' | 'dark' | 'auto')}
                    label="Theme"
                    description="Choose your preferred color scheme"
                    options={[
                      { value: 'auto', label: 'Auto (system preference)' },
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                    ]}
                  />

                  <SelectField
                    value={settings.language}
                    onChange={(value) => updateSetting('language', value)}
                    label="Interface language"
                    description="Language for the user interface"
                    options={[
                      { value: 'english', label: 'English' },
                      { value: 'japanese', label: '日本語' },
                      { value: 'spanish', label: 'Español' },
                      { value: 'french', label: 'Français' },
                      { value: 'german', label: 'Deutsch' },
                    ]}
                  />
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h2>

                  <ToggleSwitch
                    checked={settings.episodeNotifications}
                    onChange={(checked) => updateSetting('episodeNotifications', checked)}
                    label="New episode notifications"
                    description="Get notified when new episodes are available for anime in your watchlist"
                  />

                  <ToggleSwitch
                    checked={settings.newSeasonNotifications}
                    onChange={(checked) => updateSetting('newSeasonNotifications', checked)}
                    label="New season announcements"
                    description="Get notified about new season announcements and releases"
                  />

                  <ToggleSwitch
                    checked={settings.communityNotifications}
                    onChange={(checked) => updateSetting('communityNotifications', checked)}
                    label="Community activity"
                    description="Get notified about replies to your posts and mentions"
                  />

                  <ToggleSwitch
                    checked={settings.emailNotifications}
                    onChange={(checked) => updateSetting('emailNotifications', checked)}
                    label="Email notifications"
                    description="Receive notifications via email"
                  />
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Data
                  </h2>

                  <ToggleSwitch
                    checked={settings.showWatchHistory}
                    onChange={(checked) => updateSetting('showWatchHistory', checked)}
                    label="Show watch history"
                    description="Display your watch history to other users"
                  />

                  <ToggleSwitch
                    checked={settings.showWatchlist}
                    onChange={(checked) => updateSetting('showWatchlist', checked)}
                    label="Show watchlist"
                    description="Display your watchlist to other users"
                  />

                  <ToggleSwitch
                    checked={settings.analyticsOptOut}
                    onChange={(checked) => updateSetting('analyticsOptOut', checked)}
                    label="Opt out of analytics"
                    description="Disable anonymous usage analytics to help improve the service"
                  />

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">Data Management</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Manage your personal data and account information.
                    </p>
                    <div className="space-x-3">
                      <Button variant="outline" size="sm">
                        Export Data
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Advanced Settings
                  </h2>

                  <ToggleSwitch
                    checked={settings.enableDownloads}
                    onChange={(checked) => updateSetting('enableDownloads', checked)}
                    label="Enable downloads"
                    description="Allow downloading episodes for offline viewing"
                  />

                  {settings.enableDownloads && (
                    <>
                      <SelectField
                        value={settings.downloadQuality}
                        onChange={(value) => updateSetting('downloadQuality', value)}
                        label="Download quality"
                        description="Default quality for downloaded episodes"
                        options={[
                          { value: '1080p', label: '1080p (High quality, larger file)' },
                          { value: '720p', label: '720p (Good quality, medium file)' },
                          { value: '480p', label: '480p (Lower quality, smaller file)' },
                        ]}
                      />

                      <ToggleSwitch
                        checked={settings.autoDeleteDownloads}
                        onChange={(checked) => updateSetting('autoDeleteDownloads', checked)}
                        label="Auto-delete watched downloads"
                        description="Automatically delete downloaded episodes after watching"
                      />
                    </>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Cache & Storage</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Current cache size: 2.4 GB
                    </p>
                    <Button variant="outline" size="sm">
                      Clear Cache
                    </Button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <Button size="lg">
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}