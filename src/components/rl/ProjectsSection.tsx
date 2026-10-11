"use client"
import { useState } from 'react';
import { useJournal } from '@/context/JournalContextRL';
import { TargetProject, ProjectStatus } from '@/types/journal';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Clock, 
  X
} from 'lucide-react';

export default function ProjectsSection(){
  const { projects, addProject, updateProject, deleteProject, toggleProjectStatus } = useJournal();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New project form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('Days 01–30');
  const [techInput, setTechInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const techStack = techInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addProject({
      title: title.trim(),
      description: description.trim(),
      status: 'wishlist',
      targetTimeline: timeline.trim(),
      techStack: techStack.length > 0 ? techStack : ['PyTorch', 'Python'],
      notes: notes.trim()
    });

    // Reset
    setTitle('');
    setDescription('');
    setTechInput('');
    setNotes('');
    setIsAdding(false);
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-muted-foreground/60" />;
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return 'Done';
      case 'in-progress':
        return 'Active';
      default:
        return 'Target';
    }
  };

  return (
    <section 
      id="projects" 
      aria-labelledby="projects-heading"
      className="border border-border/80 rounded-lg p-5 sm:p-6 bg-card/60 backdrop-blur-sm relative"
    >
      <span className="ch ch-tl hidden md:block" />
      <span className="ch ch-tr hidden md:block" />

      {/* Section Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Aspirational Projects
            </span>
            <span aria-hidden="true" className="text-muted-foreground opacity-40">/</span>
            <span className="text-xs font-mono text-foreground">{projects.length} Target Endeavors</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Hands-on benchmark testbeds, environments, and experiments targeted during this 100-day journey.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-border bg-muted/30 hover:bg-muted text-foreground transition-colors cursor-pointer"
        >
          {isAdding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3 stroke-[2.5]" />}
          <span>{isAdding ? 'Cancel' : 'Add Target Project'}</span>
        </button>
      </div>

      {/* Add Project Inline Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="my-4 p-4 rounded-lg bg-muted/20 border border-border text-xs space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground uppercase tracking-wider">New Target Project</span>
            <span className="text-muted-foreground text-[10px]">Persists in local storage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground mb-1">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. RL on Simple CartPole"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
                required
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">Target Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                placeholder="e.g. Days 01–20"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground mb-1">Objective & Scope</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What will you implement, train, or evaluate?"
              className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                placeholder="e.g. Pygame, Gymnasium, DQN"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">Key Experiment Note</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Compare reward shaping vs sparse"
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:border-ring"
              />
            </div>
          </div>

          <div className="pt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1 rounded bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects Compact List (Small Only) */}
      <div className="divide-y divide-border/60">
        {projects.map((proj, index) => {
          return (
            <div 
              key={proj.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group transition-colors"
            >
              {/* Left Column: Number, Status Toggle, Title & Description */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Clickable Status Icon */}
                <button
                  type="button"
                  onClick={() => toggleProjectStatus(proj.id)}
                  title={`Status: ${proj.status}. Click to advance.`}
                  className="mt-0.5 p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer shrink-0"
                >
                  {getStatusIcon(proj.status)}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      0{index + 1}.
                    </span>
                    <h3 className="font-editorial text-base sm:text-lg font-bold text-foreground leading-snug">
                      {proj.title}
                    </h3>
                    {proj.targetTimeline && (
                      <span className="font-mono text-[10px] text-muted-foreground opacity-75">
                        ({proj.targetTimeline})
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                      · {getStatusLabel(proj.status)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech Stack Unboxed & Key Note */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-[11px] font-mono text-muted-foreground">
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground/80 font-medium">Stack:</span>
                        <span>{proj.techStack.join(', ')}</span>
                      </div>
                    )}
                    {proj.notes && (
                      <>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className="italic font-sans text-muted-foreground/90">
                          {proj.notes}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Quick actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start opacity-70 group-hover:opacity-100 transition-opacity">
                {proj.repoUrl && (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="View repository"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => deleteProject(proj.id)}
                  className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  title="Remove project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
