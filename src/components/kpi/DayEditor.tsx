"use client"
import React, { useState, useEffect } from 'react';
import { JournalDay, Phase, DayStatus, DayResource } from '@/types/journal';
import { useJournal } from '@/context/JournalContextKPI';
import { X, Plus, Trash2, Eye, Edit3, Code2, Save } from 'lucide-react';

const PHASES: Phase[] = [
  'C++ & CUDA Foundations',
  'Performance Engineering',
  'Frontier Kernel Engineering',
  'Distributed Training',
  'Inference & Serving',
  'Portfolio & Job Search'
];

export const DayEditorModal: React.FC = () => {
  const { editingDay, setEditingDay, updateDay, deleteDay } = useJournal();

  const [formData, setFormData] = useState<JournalDay | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [insightInput, setInsightInput] = useState('');
  const [gotchaInput, setGotchaInput] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');

  useEffect(() => {
    if (editingDay) {
      setFormData({ ...editingDay });
    } else {
      setFormData(null);
    }
  }, [editingDay]);

  if (!editingDay || !formData) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDay(formData);
  };

  const handleAddInsight = () => {
    if (!insightInput.trim()) return;
    setFormData(prev => prev ? {
      ...prev,
      keyInsights: [...(prev.keyInsights || []), insightInput.trim()]
    } : null);
    setInsightInput('');
  };

  const handleRemoveInsight = (index: number) => {
    setFormData(prev => prev ? {
      ...prev,
      keyInsights: (prev.keyInsights || []).filter((_, i) => i !== index)
    } : null);
  };

  const handleAddGotcha = () => {
    if (!gotchaInput.trim()) return;
    setFormData(prev => prev ? {
      ...prev,
      gotchas: [...(prev.gotchas || []), gotchaInput.trim()]
    } : null);
    setGotchaInput('');
  };

  const handleRemoveGotcha = (index: number) => {
    setFormData(prev => prev ? {
      ...prev,
      gotchas: (prev.gotchas || []).filter((_, i) => i !== index)
    } : null);
  };

  const handleAddResource = () => {
    if (!resourceTitle.trim()) return;
    const newRes: DayResource = {
      title: resourceTitle.trim(),
      type: 'paper',
      url: resourceUrl.trim() || undefined
    };
    setFormData(prev => prev ? {
      ...prev,
      resources: [...(prev.resources || []), newRes]
    } : null);
    setResourceTitle('');
    setResourceUrl('');
  };

  const handleRemoveResource = (index: number) => {
    setFormData(prev => prev ? {
      ...prev,
      resources: (prev.resources || []).filter((_, i) => i !== index)
    } : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card/95 border border-emerald-500/30 rounded-2xl shadow-[0_8px_32px_rgba(4,24,18,0.5)] text-foreground overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Day {String(formData.dayNumber).padStart(2, '0')}
            </span>
            <h3 className="font-editorial text-xl font-bold text-foreground">
              Log Progress & Explanation
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'write' ? 'preview' : 'write')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer"
            >
              {activeTab === 'write' ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{activeTab === 'write' ? 'Preview Entry' : 'Edit Fields'}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditingDay(null)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'preview' ? (
            /* Live Preview */
            <div className="space-y-6 bg-neutral-950/60 p-6 rounded-xl border border-neutral-800">
              <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                <span className="font-bold text-neutral-200">Day {formData.dayNumber}</span>
                <span>·</span>
                <span>{formData.date}</span>
                <span>·</span>
                <span className="text-emerald-400">{formData.phase}</span>
                <span>·</span>
                <span className="capitalize">{formData.status}</span>
              </div>
              <h2 className="font-editorial text-3xl font-bold text-neutral-100">{formData.title}</h2>
              <div className="border-l-2 border-emerald-500 pl-4 py-1 text-sm text-neutral-300 italic">
                {formData.summary}
              </div>
              <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line font-light">
                {formData.explanation}
              </div>

              {formData.formula && (
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs">
                  <div className="text-emerald-400 font-semibold uppercase">{formData.formula.name}</div>
                  <div className="p-2.5 bg-neutral-950 rounded mt-2 text-emerald-300">
                    <code>{formData.formula.latex}</code>
                  </div>
                  <div className="text-neutral-400 text-xs mt-2 italic">{formData.formula.description}</div>
                </div>
              )}

              {formData.codeSnippet && (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs">
                  <div className="text-neutral-300 font-semibold mb-2">{formData.codeSnippet.title}</div>
                  <pre className="text-neutral-300 overflow-x-auto">
                    <code>{formData.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            /* Write / Edit Form */
            <form onSubmit={handleSave} className="space-y-6 text-sm">
              {/* Row 1: Day #, Date, Status, Phase */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                    Day Number (1–100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.dayNumber}
                    onChange={(e) => setFormData({ ...formData, dayNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DayStatus })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                    Curriculum Phase
                  </label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value as Phase })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500"
                  >
                    {PHASES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Day Title / Topic
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. FlashAttention-2 Warp Partitioning & Online Softmax"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 text-base font-medium"
                  required
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Summary / TL;DR (1–2 sentences)
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief summary of what was understood or accomplished today."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              {/* Detailed Explanation */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                  Detailed Explanation & Research Notes
                </label>
                <textarea
                  rows={7}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Deep dive into what you learned, step-by-step intuition, derivations, proofs, why certain hyperparameters were chosen, etc."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Mathematical Formula Section */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold block">
                  Mathematical Equation (LaTeX)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Formula Name</label>
                    <input
                      type="text"
                      value={formData.formula?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        formula: {
                          name: e.target.value,
                          latex: formData.formula?.latex || '',
                          description: formData.formula?.description || ''
                        }
                      })}
                      placeholder="e.g. Bellman Optimality Equation"
                      className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-750 rounded text-xs text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Formula Description</label>
                    <input
                      type="text"
                      value={formData.formula?.description || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        formula: {
                          name: formData.formula?.name || '',
                          latex: formData.formula?.latex || '',
                          description: e.target.value
                        }
                      })}
                      placeholder="e.g. Recursive relationship between current state and optimal next states."
                      className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-750 rounded text-xs text-neutral-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">LaTeX Notation String</label>
                  <input
                    type="text"
                    value={formData.formula?.latex || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      formula: {
                        name: formData.formula?.name || 'Equation',
                        latex: e.target.value,
                        description: formData.formula?.description || ''
                      }
                    })}
                    placeholder="V(s) = \max_a \sum_{s'} P(s'|s, a) [R(s, a) + \gamma V(s')]"
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-750 rounded font-mono text-xs text-emerald-300"
                  />
                </div>
              </div>

              {/* Code Snippet Section */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider font-semibold block">
                  Implementation Code Snippet
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Snippet Title</label>
                    <input
                      type="text"
                      value={formData.codeSnippet?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        codeSnippet: {
                          title: e.target.value,
                          language: formData.codeSnippet?.language || 'python',
                          code: formData.codeSnippet?.code || '',
                          explanation: formData.codeSnippet?.explanation || ''
                        }
                      })}
                      placeholder="e.g. PyTorch Actor-Critic Update Step"
                      className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-750 rounded text-xs text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Language</label>
                    <input
                      type="text"
                      value={formData.codeSnippet?.language || 'python'}
                      onChange={(e) => setFormData({
                        ...formData,
                        codeSnippet: {
                          title: formData.codeSnippet?.title || 'Code Snippet',
                          language: e.target.value,
                          code: formData.codeSnippet?.code || '',
                          explanation: formData.codeSnippet?.explanation || ''
                        }
                      })}
                      className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-750 rounded font-mono text-xs text-neutral-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Code</label>
                  <textarea
                    rows={6}
                    value={formData.codeSnippet?.code || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      codeSnippet: {
                        title: formData.codeSnippet?.title || 'Code Snippet',
                        language: formData.codeSnippet?.language || 'python',
                        code: e.target.value,
                        explanation: formData.codeSnippet?.explanation || ''
                      }
                    })}
                    placeholder="def train_step(...):&#10;    ..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-750 rounded font-mono text-xs text-neutral-200"
                  />
                </div>
              </div>

              {/* Key Insights List */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Key Takeaways
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={insightInput}
                    onChange={(e) => setInsightInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInsight(); }}}
                    placeholder="Add a core takeaway bullet..."
                    className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddInsight}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.keyInsights?.map((k, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-neutral-950/80 border border-neutral-850 text-xs">
                      <span className="text-neutral-300">• {k}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInsight(i)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gotchas List */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Gotchas & Debugging Lessons
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gotchaInput}
                    onChange={(e) => setGotchaInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddGotcha(); }}}
                    placeholder="Add a real-world gotcha (e.g. Always detach bootstrap targets)..."
                    className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddGotcha}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.gotchas?.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-neutral-950/80 border border-neutral-850 text-xs">
                      <span className="text-amber-200/90">⚠ {g}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGotcha(i)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paper References List */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  References & Literature
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="Paper Title or Textbook Citation"
                    className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={resourceUrl}
                      onChange={(e) => setResourceUrl(e.target.value)}
                      placeholder="URL (optional)"
                      className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddResource}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="space-y-1 mt-2">
                  {formData.resources?.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-neutral-950/80 border border-neutral-850 text-xs">
                      <span className="text-neutral-300">📖 {r.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(i)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/90">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete Day ${formData.dayNumber}? This cannot be undone.`)) {
                deleteDay(formData.id);
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Day</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingDay(null)}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 border border-lime-400 rounded-xl transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Update Day</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
