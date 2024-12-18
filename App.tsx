import React from 'react';
import { AudioProcessor } from './components/AudioProcessor';

export default function App() {
  return (
    <div className="min-h-screen crt bg-[#1a1a1a] text-[#a0a0a0] p-4 sm:p-6">
      <div className="min-w-[315px] max-w-[620px] mx-auto space-y-6">
        <AudioProcessor />
      </div>
    </div>
  );
}