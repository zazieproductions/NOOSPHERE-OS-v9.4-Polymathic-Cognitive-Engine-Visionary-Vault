import React, { useState, useMemo } from 'react';
import { VaultNote, NodeCategory } from '../../types';
import { VAULT_NOTES } from '../../data/vaultNotes';
import { audioEngine } from '../../services/audioEngine';
import { 
  Search, 
  BookOpen, 
  Edit3, 
  Plus, 
  Star, 
  Pin, 
  ExternalLink, 
  Hash, 
  Eye, 
  Copy, 
  Check, 
  Sparkles,
  Download,
  Filter
} from 'lucide-react';

interface VaultNotesViewProps {
  initialNoteId?: string;
  onJumpToNode?: (nodeId: string) => void;
  onSynthesizeFromNote?: (note: VaultNote) => void;
}

export const VaultNotesView: React.FC<VaultNotesViewProps> = ({
  initialNoteId,
  onJumpToNode,
  onSynthesizeFromNote
}) => {
  const [notes, setNotes] = useState<VaultNote[]>(VAULT_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(initialNoteId || VAULT_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NodeCategory | 'all'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active note
  const activeNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || notes[0];
  }, [notes, selectedNoteId]);

  // Edited note buffer
  const [editTitle, setEditTitle] = useState(activeNote?.title || '');
  const [editContent, setEditContent] = useState(activeNote?.content || '');

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchCat = selectedCategory === 'all' || n.category === selectedCategory;
      const matchSearch = !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [notes, selectedCategory, searchQuery]);

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setIsEditing(false);
    const n = notes.find(note => note.id === id);
    if (n) {
      setEditTitle(n.title);
      setEditContent(n.content);
    }
    audioEngine.playNodeBlip(700);
  };

  const handleSaveEdit = () => {
    setNotes(prev => prev.map(n => {
      if (n.id === selectedNoteId) {
        return {
          ...n,
          title: editTitle,
          content: editContent,
          excerpt: editContent.slice(0, 140).replace(/#|>|\[!.*?\]/g, '') + '...'
        };
      }
      return n;
    }));
    setIsEditing(false);
    audioEngine.playEurekaChord();
  };

  const handleCreateNewNote = () => {
    const newId = `note-${Date.now()}`;
    const newNote: VaultNote = {
      id: newId,
      title: 'Synthesized Epistemic Thesis #' + (notes.length + 1),
      category: 'semiotics',
      cognitiveDensity: 95,
      readTime: '3 min read',
      tags: ['new-paradigm', 'synthesis', 'polymathic'],
      dateCreated: new Date().toISOString().split('T')[0],
      excerpt: 'Fresh cognitive synthesis awaiting deconstruction and structural codification...',
      backlinks: ['[[Baudrillardian Simulacra]]', '[[Deleuzian Rhizome]]'],
      isPinned: false,
      isFavorite: false,
      content: `# Synthesized Epistemic Thesis

> [!VISION]
> *"Formulate the inevitable paradigm shift before market consensus awakens."*

## 1. Axiomatic Premise
Write your polymathic insight here using **markdown**, *italics*, and wikilinks like [[Deleuzian Rhizome]].

## 2. Tactical GTM Execution
- Deploy autopoietic content flywheels
- Establish impenetrable brand lore
- Maximize information entropy in outbound messaging
`
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newId);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
    audioEngine.playEurekaChord();
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    audioEngine.playSynapticClick(1500);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([activeNote.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeNote.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    audioEngine.playSynapticClick(1200);
  };

  // Render formatted markdown with custom callouts & wikilinks
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let inCallout = false;
    let calloutType = 'NOTE';
    let calloutBuffer: string[] = [];

    const flushCodeBlock = (key: number) => {
      elements.push(
        <pre key={`code-${key}`} className="p-3 my-3 bg-zinc-950 border border-zinc-800 rounded text-emerald-400 font-mono text-[11px] overflow-x-auto">
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      );
      codeBuffer = [];
      inCodeBlock = false;
    };

    const flushCallout = (key: number) => {
      const calloutColors: Record<string, { border: string; bg: string; titleColor: string }> = {
        NOTE: { border: 'border-blue-500/60', bg: 'bg-blue-950/20', titleColor: 'text-blue-400' },
        VISION: { border: 'border-purple-500/60', bg: 'bg-purple-950/20', titleColor: 'text-purple-400' },
        HYPERSTITION: { border: 'border-emerald-500/60', bg: 'bg-emerald-950/20', titleColor: 'text-emerald-400' },
        STRATEGY: { border: 'border-amber-500/60', bg: 'bg-amber-950/20', titleColor: 'text-amber-400' },
        BIOMIMICRY: { border: 'border-lime-500/60', bg: 'bg-lime-950/20', titleColor: 'text-lime-400' },
        MEME: { border: 'border-pink-500/60', bg: 'bg-pink-950/20', titleColor: 'text-pink-400' },
      };
      const theme = calloutColors[calloutType] || calloutColors.NOTE;

      elements.push(
        <div key={`callout-${key}`} className={`my-3 p-3 rounded-r border-l-4 ${theme.border} ${theme.bg} text-xs text-zinc-300`}>
          <div className={`font-bold tracking-wider uppercase text-[10px] mb-1 flex items-center gap-1.5 ${theme.titleColor}`}>
            <Sparkles className="w-3 h-3" />
            <span>[{calloutType}]</span>
          </div>
          <div>{calloutBuffer.join(' ')}</div>
        </div>
      );
      calloutBuffer = [];
      inCallout = false;
    };

    const parseInline = (line: string) => {
      // Parse Wikilinks [[Concept]]
      const parts = line.split(/(\[\[.*?\]\]|\*\*.*?\*\*|\$.*?\$|`.*?`)/g);
      return parts.map((part, i) => {
        if (part.startsWith('[[') && part.endsWith(']]')) {
          const concept = part.slice(2, -2);
          return (
            <span
              key={i}
              onClick={() => {
                audioEngine.playNodeBlip(1100);
                // Search for matching note
                const matched = notes.find(n => n.title.toLowerCase().includes(concept.toLowerCase()));
                if (matched) {
                  setSelectedNoteId(matched.id);
                }
              }}
              className="inline-flex items-center text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 rounded px-1.5 py-0.2 cursor-pointer transition-colors font-semibold"
            >
              <ExternalLink className="w-2.5 h-2.5 mr-1" />
              {concept}
            </span>
          );
        } else if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-zinc-100 font-bold">{part.slice(2, -2)}</strong>;
        } else if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-cyan-300 font-mono text-[11px]">{part.slice(1, -1)}</code>;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          return <span key={i} className="text-purple-300 font-mono italic px-1 bg-purple-950/30 rounded">{part.slice(1, -1)}</span>;
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock(index);
        } else {
          inCodeBlock = true;
        }
        return;
      }
      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('> [!')) {
        if (inCallout) flushCallout(index);
        const match = line.match(/> \[!(.*?)\]/);
        calloutType = match ? match[1].toUpperCase() : 'NOTE';
        inCallout = true;
        return;
      }

      if (inCallout) {
        if (line.startsWith('>')) {
          calloutBuffer.push(line.replace(/^>\s*/, ''));
          return;
        } else {
          flushCallout(index);
        }
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-lg sm:text-xl font-bold text-zinc-100 mt-4 mb-3 font-display tracking-wide border-b border-zinc-800 pb-2">
            {line.replace(/^#\s*/, '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-sm sm:text-base font-bold text-emerald-400 mt-4 mb-2 font-display uppercase tracking-wider">
            {line.replace(/^##\s*/, '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xs sm:text-sm font-bold text-cyan-400 mt-3 mb-1.5 font-display">
            {line.replace(/^###\s*/, '')}
          </h3>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={index} className="ml-4 list-disc text-zinc-300 text-xs my-1 leading-relaxed">
            {parseInline(line.replace(/^[-*]\s*/, ''))}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(
          <p key={index} className="text-zinc-300 text-xs leading-relaxed my-1.5">
            {parseInline(line)}
          </p>
        );
      }
    });

    if (inCodeBlock) flushCodeBlock(lines.length);
    if (inCallout) flushCallout(lines.length);

    return elements;
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#05070d] text-zinc-100 overflow-hidden font-mono-code">
      {/* Left Sidebar: Vault File Explorer */}
      <div className="w-full md:w-72 border-r border-zinc-800/80 bg-zinc-950/90 flex flex-col flex-shrink-0 h-48 md:h-full">
        {/* Search & Actions Header */}
        <div className="p-2.5 border-b border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Obsidian Vault ({notes.length})</span>
            </span>
            <button
              onClick={handleCreateNewNote}
              title="New Note"
              className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, wikilinks..."
              className="w-full pl-7 pr-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Note List Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
          {filteredNotes.map((note) => {
            const isSelected = note.id === selectedNoteId;
            return (
              <div
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
                className={`p-2.5 cursor-pointer transition-colors text-xs ${
                  isSelected
                    ? 'bg-emerald-950/40 border-l-2 border-emerald-500 text-zinc-100'
                    : 'hover:bg-zinc-900/60 text-zinc-400'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className={`font-bold text-xs truncate ${isSelected ? 'text-emerald-300' : 'text-zinc-200'}`}>
                    {note.title}
                  </h4>
                  {note.isPinned && <Pin className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                </div>

                <p className="text-[10px] text-zinc-500 line-clamp-2 mb-1.5 leading-snug">
                  {note.excerpt}
                </p>

                <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                  <span className="uppercase px-1 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {note.category}
                  </span>
                  <span>Density: {note.cognitiveDensity}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Pane: Note Reader / Editor */}
      <div className="flex-1 flex flex-col h-full bg-[#07090f] overflow-hidden">
        {/* Top Note Action Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/60 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {activeNote.category}
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-zinc-400 text-xs">{activeNote.readTime}</span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-zinc-400 text-xs">Density: <strong className="text-emerald-400">{activeNote.cognitiveDensity}%</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-colors border ${
                isEditing
                  ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-emerald-400'
              }`}
            >
              {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Preview' : 'Edit Note'}</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              title="Copy Markdown"
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownloadMarkdown}
              title="Export .md file"
              className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Note Body: Reader or Editor */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl w-full mx-auto">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs uppercase font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-zinc-100 font-display font-bold text-base focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs uppercase font-bold mb-1">Markdown Content</label>
                <textarea
                  rows={16}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 font-mono text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                >
                  Save to Vault
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Rendered Markdown */}
              <article className="prose prose-invert max-w-none">
                {renderMarkdown(activeNote.content)}
              </article>

              {/* Backlinks & Connected Nodes footer */}
              {activeNote.backlinks && activeNote.backlinks.length > 0 && (
                <div className="mt-8 pt-4 border-t border-zinc-800">
                  <h4 className="text-xs uppercase font-bold text-zinc-400 mb-2 flex items-center gap-1.5">
                    <Hash className="w-3 h-3 text-emerald-400" />
                    <span>Bidirectional Synaptic Backlinks</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeNote.backlinks.map((link, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded bg-zinc-900 text-emerald-400 border border-zinc-800 font-mono hover:border-emerald-500 transition-colors"
                      >
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
