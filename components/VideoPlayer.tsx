'use client';

import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { IVideoSource } from '@/types/anime';

interface VideoPlayerProps {
  sources: IVideoSource[];
  title?: string;
  onEnded?: () => void;
  onProgress?: (progress: number) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  sources,
  title,
  onEnded,
  onProgress,
  className = '',
}) => {
  const [currentSource, setCurrentSource] = useState<IVideoSource | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState<string>('auto');

  useEffect(() => {
    if (sources && sources.length > 0) {
      // Select best quality source by default
      const bestSource = sources.find(s => s.quality?.toLowerCase() === '1080p') ||
                         sources.find(s => s.quality?.toLowerCase() === '720p') ||
                         sources[0];
      setCurrentSource(bestSource);
      setIsLoading(false);
    }
  }, [sources]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  const handleProgress = (progress: { played: number }) => {
    if (onProgress) {
      onProgress(progress.played * 100);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const player = document.getElementById('video-player');
    if (player) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        player.requestFullscreen();
      }
    }
  };

  const changeQuality = (source: IVideoSource) => {
    setCurrentSource(source);
    setQuality(source.quality || 'auto');
  };

  if (!currentSource) {
    return (
      <div className={`bg-black rounded-lg flex items-center justify-center h-64 ${className}`}>
        <div className="text-white text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p>Loading video sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`} id="video-player">
      <div className="relative aspect-video">
        <ReactPlayer
          url={currentSource.url}
          playing={isPlaying}
          muted={isMuted}
          controls={false}
          width="100%"
          height="100%"
          onPlay={handlePlay}
          onPause={handlePause}
          onReady={handleReady}
          onProgress={handleProgress}
          onEnded={onEnded}
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous',
              },
            },
          }}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <LoadingSpinner size="lg" className="text-white" />
          </div>
        )}

        {/* Custom controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Title */}
          {title && (
            <div className="absolute top-4 left-4 text-white">
              <h3 className="text-lg font-medium">{title}</h3>
            </div>
          )}

          {/* Center play/pause button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-16 h-16 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white hover:bg-opacity-20"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white hover:bg-opacity-20"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>

            <div className="flex-1" />

            {/* Quality selector */}
            {sources.length > 1 && (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {quality}
                </Button>
                <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded-md py-2 opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px]">
                  {sources.map((source, index) => (
                    <button
                      key={index}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 text-sm"
                      onClick={() => changeQuality(source)}
                    >
                      {source.quality || `Source ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white hover:bg-opacity-20"
              onClick={toggleFullscreen}
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};