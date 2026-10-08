"use client"
import { useState, useMemo } from 'react';
import { useJournal } from '@/context/JournalContextRL';
import { LearningResource, ResourceCategory } from '@/types/rl-journal';
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
  Globe 
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

export default function ResourceDumpSection() {
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
      case 'course': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'video': return <Video className="w-3.5 h-3.5" />;
      case 'paper': return <FileText className="w-3.5 h-3.5" />;
      case 'book': return <BookOpen className="w-3.5 h-3.5" />;
      case 'repo': return <Github className="w-3.5 h-3.5" />;
      default: return <Globe className="w-3.5 h-3.5" />;
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
      className="border border-border/80 rounded-lg p-5 sm:p-6 bg-card/60 backdrop-blur-sm relative"
    >
      <span className="ch ch-tl hidden md:block" />
      <span className="ch ch-tr hidden md:block" />

      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Research & Study Dump
            </span>
            <span aria-hidden="true" className="text-muted-foreground opacity-40">/</span>
            <span className="text-xs font-mono text-foreground">{resources.length} Reference Materials</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Quickly dump courses, papers, blogs, and videos you are consuming during the 100 days.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          {isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
          <span>{isFormOpen ? 'Close Form' : 'Dump New Resource'}</span>
        </button>
      </div>

      {/* Quick Dump Drawer / Form */}
      {isFormOpen && (
        <form onSubmit={handleQuickDump} className="my-5 p-5 rounded-lg border border-border bg-muted/20 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="font-bold text-foreground uppercase tracking-wider">
              Dump Reference to Notebook
            </span>
            <span className="text-muted-foreground text-[10px]">
              Stored persistently in your browser
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-muted-foreground mb-1">Resource URL or Reference</label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://... (or book title)"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
                required
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">Media Type</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ResourceCategory)}
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring cursor-pointer"
              >
                <option value="blog">Blog / Essay</option>
                <option value="course">Course / Syllabus</option>
                <option value="paper">Academic Paper</option>
                <option value="video">Video Lecture / Talk</option>
                <option value="book">Textbook / Monograph</option>
                <option value="repo">GitHub Repository</option>
                <option value="other">Other Reference</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Deep Reinforcement Learning: Pong from Pixels"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
                required
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">Author / Institution</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Andrej Karpathy / Stanford / DeepMind"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground mb-1">Key Takeaway or Summary Note</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Best intuition for policy gradient baseline derivation"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="e.g. Policy Gradients, Foundations, PyTorch"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save to Resource Dump
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-2.5 py-1 rounded border whitespace-nowrap transition-colors cursor-pointer text-[11px] ${
                  isSelected
                    ? 'bg-foreground text-background border-foreground font-semibold shadow-sm'
                    : 'bg-muted/20 text-muted-foreground hover:text-foreground border-border hover:border-foreground/30'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dumped media..."
            className="w-full pl-8 pr-7 py-1 rounded border border-border bg-muted/20 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-ring"
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
              className="p-4 rounded-lg border border-border/70 bg-card hover:border-border transition-all flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                {/* Top Row: Category Tag, Date & Actions */}
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5 uppercase font-semibold text-foreground/80">
                    {getCategoryIcon(res.category)}
                    <span>{res.category}</span>
                    {res.authorOrSource && (
                      <>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className="font-normal text-muted-foreground lowercase first-letter:uppercase truncate max-w-[140px]">
                          {res.authorOrSource}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleResourceFavorite(res.id)}
                      title={res.isFavorite ? 'Remove favorite' : 'Mark as favorite'}
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        res.isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${res.isFavorite ? 'fill-amber-500' : ''}`} />
                    </button>
                    {res.url && (
                      <button
                        type="button"
                        onClick={() => handleCopyLink(res.id, res.url)}
                        title="Copy link"
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {copiedId === res.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteResource(res.id)}
                      title="Delete reference"
                      className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Resource Title & Direct Link */}
                <h4 className="font-editorial text-base sm:text-lg font-bold text-foreground leading-snug">
                  {res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline inline-flex items-baseline gap-1"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-60 shrink-0 inline translate-y-[-1px]" />
                    </a>
                  ) : (
                    <span>{res.title}</span>
                  )}
                </h4>

                {/* Personal Notes / Takeaway */}
                {res.notes && (
                  <p className="text-xs text-muted-foreground font-light leading-relaxed pl-2.5 border-l-2 border-foreground/20 italic">
                    "{res.notes}"
                  </p>
                )}
              </div>

              {/* Tags & Date Added */}
              <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-muted-foreground">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(res.tags || []).map((tag, idx) => (
                    <span key={idx} className="opacity-80">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span>Added {res.dateAdded}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-lg p-6">
            <p className="text-sm font-editorial text-foreground">No resources match your filter</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Dump your favorite RL links, papers, or YouTube playlists above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
