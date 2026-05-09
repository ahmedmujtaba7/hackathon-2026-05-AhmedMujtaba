'use client';

import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface HintButtonProps {
  hintUsed: boolean;
  hint: string | null;
  loading: boolean;
  onRequestHint: () => void;
}

export function HintButton({ hintUsed, hint, loading, onRequestHint }: HintButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  // If hint has already been received and is displayed
  if (hint) {
    return (
      <div className="border border-accent/40 bg-accent/5 rounded p-3 space-y-1">
        <div className="flex items-center gap-1.5">
          <Lightbulb size={12} className="text-accent shrink-0" />
          <span className="text-accent text-xs font-mono tracking-widest uppercase">Hint</span>
        </div>
        <p className="text-foreground text-sm font-serif italic leading-relaxed">{hint}</p>
      </div>
    );
  }

  // Hint already used but no text in state (page reload edge case)
  if (hintUsed) {
    return (
      <div className="border border-border rounded p-3">
        <p className="text-muted text-xs font-mono italic">Hint already used this session.</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-xs font-mono p-2">
        <Spinner size="sm" />
        <span>Consulting case files...</span>
      </div>
    );
  }

  // Confirm prompt
  if (showConfirm) {
    return (
      <div
        className="rounded-lg p-3.5 space-y-3"
        style={{
          background: 'rgba(201,162,39,0.07)',
          border: '1px solid rgba(201,162,39,0.30)',
        }}
      >
        <p className="text-[#e8c84a] text-xs font-mono leading-relaxed">
          You only get one hint. Use it wisely. Are you sure?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowConfirm(false);
              onRequestHint();
            }}
            className="text-xs font-mono bg-accent text-background font-bold px-3 py-1.5 rounded uppercase tracking-widest hover:bg-accent-hover active:scale-[0.97] transition-all"
          >
            Yes, reveal
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-xs font-mono px-3 py-1.5 rounded uppercase tracking-widest transition-all"
            style={{
              border: '1px solid rgba(237,230,214,0.30)',
              color: 'rgba(237,230,214,0.75)',
              background: 'rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,162,39,0.50)';
              (e.currentTarget as HTMLButtonElement).style.color = '#e8c84a';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(237,230,214,0.30)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(237,230,214,0.75)';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Default state — show request button
  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full flex items-center gap-2 rounded-lg p-2.5 transition-all text-xs font-mono uppercase tracking-widest group"
      style={{
        border: '1px solid rgba(201,162,39,0.25)',
        color: 'rgba(237,230,214,0.65)',
        background: 'rgba(0,0,0,0.25)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,162,39,0.55)';
        (e.currentTarget as HTMLButtonElement).style.color = '#e8c84a';
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,162,39,0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,162,39,0.25)';
        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(237,230,214,0.65)';
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.25)';
      }}
    >
      <Lightbulb size={13} style={{ color: '#c9a227' }} />
      Request Hint (one-time only)
    </button>
  );
}
