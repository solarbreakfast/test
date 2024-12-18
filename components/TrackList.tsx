import React from 'react';
import { Volume2, VolumeX, Trash2 } from 'lucide-react';
import { AudioTrack } from '../types/audio';

interface TrackListProps {
  tracks: AudioTrack[];
  activeTrackId: string | null;
  onTrackSelect: (trackId: string) => void;
  onTrackRemove: (trackId: string) => void;
  onTrackMute: (trackId: string) => void;
  onVolumeChange: (trackId: string, volume: number) => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  activeTrackId,
  onTrackSelect,
  onTrackRemove,
  onTrackMute,
  onVolumeChange
}) => {
  return (
    <div className="space-y-2">
      {tracks.map(track => (
        <div
          key={track.id}
          className={`
            flex items-center gap-4 p-3 rounded-lg border transition-all
            ${track.id === activeTrackId
              ? 'bg-[#2a2a2a] border-[#66bb6a] shadow-[0_0_10px_rgba(102,187,106,0.1)]'
              : 'bg-[#1a1a1a] border-[#333] hover:bg-[#222]'
            }
          `}
        >
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <button
              onClick={() => onTrackSelect(track.id)}
              className="text-left w-full"
            >
              <div className="font-medium text-[#a0a0a0] truncate">
                {track.name}
              </div>
              <div className="text-xs text-[#808080]">
                {track.buffer.duration.toFixed(1)}s • {track.buffer.numberOfChannels}ch
              </div>
            </button>
          </div>

          {/* Track controls */}
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={track.volume}
              onChange={(e) => onVolumeChange(track.id, Number(e.target.value))}
              className="w-24 slider"
            />
            
            <button
              onClick={() => onTrackMute(track.id)}
              className={`p-2 rounded-lg transition-colors ${
                track.isMuted
                  ? 'bg-[#2a2a2a] text-[#ef5350]'
                  : 'hover:bg-[#2a2a2a] text-[#808080]'
              }`}
            >
              {track.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              onClick={() => onTrackRemove(track.id)}
              className="p-2 rounded-lg text-[#808080] hover:bg-[#2a2a2a] transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {tracks.length === 0 && (
        <div className="text-center py-8 text-[#808080]">
          <p>No tracks added yet</p>
          <p className="text-sm mt-1">Drop an audio file to get started</p>
        </div>
      )}
    </div>
  );
};