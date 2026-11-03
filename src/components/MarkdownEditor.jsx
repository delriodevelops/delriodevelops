'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, Edit3, Columns } from 'lucide-react';

/**
 * Enhanced Markdown Editor with live preview
 * Similar to StackEdit - side by side editing experience
 */
export default function MarkdownEditor({
    value,
    onChange,
    placeholder = "# Write your content here...",
    minHeight = "500px"
}) {
    const [viewMode, setViewMode] = useState('split'); // 'edit', 'preview', 'split'
    const textareaRef = useRef(null);
    const previewRef = useRef(null);

    // Sync scroll between editor and preview in split mode
    const handleScroll = (e) => {
        if (viewMode !== 'split') return;

        const source = e.target;
        const target = source === textareaRef.current ? previewRef.current : textareaRef.current;

        if (target) {
            const scrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
            target.scrollTop = scrollPercentage * (target.scrollHeight - target.clientHeight);
        }
    };

    // Parse markdown to HTML
    const parseMarkdown = (text) => {
        if (!text) return '<p style="color: #666; font-style: italic;">Start writing to see preview...</p>';

        let html = text
            // Escape HTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')

            // Headers
            .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.3rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: #fff;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.6rem; font-weight: 700; margin: 2rem 0 1rem; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="font-size: 2rem; font-weight: 800; margin: 2rem 0 1rem; color: #fff;">$1</h1>')

            // Bold and Italic
            .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong style="color: #fff;">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')

            // Code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; font-family: monospace; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1);"><code>$2</code></pre>')

            // Inline code
            .replace(/`(.*?)`/gim, '<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>')

            // Images
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<div style="margin: 1.5rem 0;"><img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" /><p style="text-align: center; color: #888; font-size: 0.85rem; margin-top: 0.5rem; font-family: monospace;">$1</p></div>')

            // Links
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" style="color: inherit; text-decoration: underline; text-decoration-color: var(--signal);">$1</a>')

            // Blockquotes
            .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 2px solid var(--signal); padding-left: 1rem; margin: 1rem 0; font-style: italic;">$1</blockquote>')

            // Horizontal rules
            .replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2rem 0;" />')

            // Unordered lists
            .replace(/^\- (.*$)/gim, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem; list-style-type: disc;">$1</li>')

            // Ordered lists
            .replace(/^\d+\. (.*$)/gim, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem; list-style-type: decimal;">$1</li>')

            // Paragraphs (handle line breaks)
            .replace(/\n\n/gim, '</p><p style="margin-bottom: 1rem; line-height: 1.8; color: #ccc;">')
            .replace(/\n/gim, '<br />');

        // Wrap in paragraph if not starting with a block element
        if (!html.startsWith('<h') && !html.startsWith('<pre') && !html.startsWith('<blockquote') && !html.startsWith('<ul') && !html.startsWith('<ol') && !html.startsWith('<hr') && !html.startsWith('<div')) {
            html = '<p style="margin-bottom: 1rem; line-height: 1.8; color: #ccc;">' + html + '</p>';
        }

        return html;
    };

    const viewButtons = [
        { id: 'edit', icon: Edit3, label: 'Edit' },
        { id: 'split', icon: Columns, label: 'Split' },
        { id: 'preview', icon: Eye, label: 'Preview' },
    ];

    return (
        <div className="markdown-editor">
            {/* Toolbar */}
            <div className="ed-admin-panel-head">
                <div className="flex gap-2">
                    {viewButtons.map((btn) => (
                        <button
                            key={btn.id}
                            type="button"
                            onClick={() => setViewMode(btn.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs uppercase tracking-wider transition-all ${viewMode === btn.id
                                    ? 'ed-tab is-active'
                                    : 'ed-tab'
                                }`}
                        >
                            <btn.icon size={14} />
                            {btn.label}
                        </button>
                    ))}
                </div>

                <div className="ed-mono">
                    {value?.length || 0} chars • {value?.split(/\s+/).filter(Boolean).length || 0} words
                </div>
            </div>

            {/* Editor Area */}
            <div
                className="flex gap-4"
                style={{ minHeight }}
            >
                {/* Editor */}
                {(viewMode === 'edit' || viewMode === 'split') && (
                    <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                        <div className="ed-label">
                            Markdown
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="ed-textarea w-full h-full resize-none"
                            style={{ minHeight: `calc(${minHeight} - 30px)` }}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onScroll={handleScroll}
                        />
                    </div>
                )}

                {/* Preview */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                    <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                        <div className="ed-label">
                            Preview
                        </div>
                        <div
                            ref={previewRef}
                            className="ed-prose ed-editor-preview w-full p-6 overflow-y-auto"
                            style={{ minHeight: `calc(${minHeight} - 30px)` }}
                            onScroll={handleScroll}
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
                        />
                    </div>
                )}
            </div>

            {/* Markdown Help */}
            <div className="ed-editor-foot mt-4 pt-4">
                <details className="ed-mono">
                    <summary className="ed-mono cursor-pointer">
                        Markdown Cheatsheet
                    </summary>
                    <div className="ed-mono mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <span className="ed-mono"># Heading 1</span>
                        </div>
                        <div>
                            <span className="ed-mono">## Heading 2</span>
                        </div>
                        <div>
                            <span className="ed-mono">**bold**</span>
                        </div>
                        <div>
                            <span className="ed-mono">*italic*</span>
                        </div>
                        <div>
                            <span className="ed-mono">[link](url)</span>
                        </div>
                        <div>
                            <span className="ed-mono">![alt](image-url)</span>
                        </div>
                        <div>
                            <span className="ed-mono">- list item</span>
                        </div>
                        <div>
                            <span className="ed-mono">&gt; quote</span>
                        </div>
                        <div>
                            <span className="ed-mono">`code`</span>
                        </div>
                        <div>
                            <span className="ed-mono">```code block```</span>
                        </div>
                        <div>
                            <span className="ed-mono">---</span> <span className="ed-mono">(horizontal rule)</span>
                        </div>
                        <div>
                            <span className="ed-mono">1. numbered list</span>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}
