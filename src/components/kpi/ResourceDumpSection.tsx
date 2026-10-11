"use client"
import React, { useState, useMemo } from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { ResourceCategory } from '@/types/journal';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Check, 
  Star, 
  X, 
  BookOpen, 
  Video, 
  FileText, 
  GraduationCap, 
  Github, 
  Globe,
  Database
} from 'lucide-react';

const CATEGORIES: { key: ResourceCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Media' },
  { key: 'course', label: 'Courses' },
  { key: 'blog', label: 'Blogs & Essays' },
  { key: 'paper', label: 'Papers' },
  { key: 'video', label: 'Videos & Lectures' },
  { key: 'book', label: 'Books' },
  { key: 'repo', label: 'Repositories' }
];

export const ResourceDumpSection: React.FC = () => {
  const { resources, addResource, deleteResource, toggleResourceFavorite } = useJournal();

  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('blog');
  const [author, setAuthor] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleQuickDump = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !url.trim()) return;

    let finalTitle = title.trim();
    if (!finalTitle && url.trim()) {
      try {
        const u = new URL(url.trim());
        finalTitle = u.hostname + u.pathname;
      } catch {
        finalTitle = url.trim();
      }
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addResource({
      title: finalTitle,
      url: url.trim(),
      category,
      authorOrSource: author.trim(),
      notes: notes.trim(),
      tags: tags.length > 0 ? tags : undefined,
      isFavorite: false
    });

    // Reset Form
    setUrl('');
    setTitle('');
    setAuthor('');
    setNotes('');
    setTagsInput('');
    setIsFormOpen(false);
  };

  const handleCopyLink = async (id: string, resourceUrl: string) => {
    try {
      await navigator.clipboard.writeText(resourceUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const getCategoryIcon = (cat: ResourceCategory) => {
    switch (cat) {
      case 'course': return <GraduationCap className="w-3.5 h-3.5 text-lime-400" />;
      case 'video': return <Video className="w-3.5 h-3.5 text-teal-400" />;
      case 'paper': return <FileText className="w-3.5 h-3.5 text-lime-300" />;
      case 'book': return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      case 'repo': return <Github className="w-3.5 h-3.5 text-slate-300" />;
      default: return <Globe className="w-3.5 h-3.5 text-lime-400" />;
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      if (activeCategory !== 'all' && res.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = res.title.toLowerCase().includes(q);
        const inAuthor = (res.authorOrSource || '').toLowerCase().includes(q);
        const inNotes = (res.notes || '').toLowerCase().includes(q);
        const inTags = (res.tags || []).some(t => t.toLowerCase().includes(q));
        return inTitle || inAuthor || inNotes || inTags;
      }
      return true;
    });
  }, [resources, activeCategory, searchQuery]);

  return (
    <section 
      id="resources" 
      aria-labelledby="resources-heading"
      className="border border-emerald-500/25 rounded-2xl p-5 sm:p-6 bg-card/80 backdrop-blur-md relative shadow-[0_4px_24px_rgba(4,24,18,0.25)]"
    >
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-lime-400 font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-lime-400" />
              Research & Study Dump
            </span>
            <span aria-hidden="true" className="text-muted-foreground opacity-30">/</span>
            <span className="text-xs font-mono text-foreground font-medium">{resources.length} Reference Materials</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Courses, papers, blogs, and videos I am consuming during the 250 days.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all cursor-pointer text-[11px] ${
                  isSelected
                    ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold'
                    : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/70 hover:border-lime-400/30'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search input with lemongrass border */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-lime-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dumped media..."
            className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-border/80 bg-card/80 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-lime-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.length > 0 ? (
          filteredResources.map(res => (
            <div 
              key={res.id}
              className="p-4 rounded-xl border border-emerald-500/20 bg-card/60 hover:border-lime-400/40 hover:shadow-[0_0_16px_rgba(190,242,100,0.1)] transition-all flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                {/* Top Row: Category Tag, Date & Actions */}
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5 uppercase font-semibold text-lime-400">
                    {getCategoryIcon(res.category)}
                    <span>{res.category}</span>
                    {res.authorOrSource && (
                      <>
                        <span aria-hidden="true" className="opacity-30 text-muted-foreground">·</span>
                        <span className="font-normal text-muted-foreground lowercase first-letter:uppercase truncate max-w-[140px]">
                          {res.authorOrSource}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {res.url && (
                      <button
                        type="button"
                        onClick={() => handleCopyLink(res.id, res.url)}
                        title="Copy link"
                        className="p-1 rounded text-muted-foreground hover:text-lime-400 transition-colors cursor-pointer"
                      >
                        {copiedId === res.id ? (
                          <Check className="w-3.5 h-3.5 text-lime-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Resource Title */}
                <h4 className="font-editorial text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-lime-300 transition-colors">
                  {res.title}
                </h4>

                {/* Summary / Notes */}
                {res.notes && (
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {res.notes}
                  </p>
                )}

                {/* Tags (Unboxed with subtle typographic separators) */}
                {res.tags && res.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-muted-foreground">
                    <span className="text-lime-400/80">#</span>
                    {res.tags.map((t, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-muted-foreground hover:text-foreground">{t}</span>
                        {idx < res.tags!.length - 1 && <span aria-hidden="true" className="opacity-30">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Row: Direct Link CTA */}
              {res.url && (
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-lime-400 hover:text-lime-300 transition-colors underline underline-offset-2"
                  >
                    <span>Inspect Material</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    {res.dateAdded}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl">
            <p className="text-sm text-foreground font-editorial">No resources match your search criteria</p>
            <p className="text-xs text-muted-foreground mt-1">Try another category filter or add a fresh paper/course above.</p>
          </div>
        )}
      </div>
    </section>
  );
};
