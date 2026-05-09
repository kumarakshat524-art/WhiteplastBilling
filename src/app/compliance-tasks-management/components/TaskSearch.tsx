'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'comment' | 'document';
  category: string;
  assignee: string;
  highlight: string;
}

interface TaskSearchProps {
  onSearch: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
  className?: string;
}

const TaskSearch = ({ onSearch, onResultSelect, className = '' }: TaskSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 'CT-001',
      title: 'Update Data Privacy Policy for GDPR Compliance',
      type: 'task',
      category: 'Policy Updates',
      assignee: 'Sarah Johnson',
      highlight: 'GDPR compliance requirements for data processing activities'
    },
    {
      id: 'CT-015',
      title: 'SOC 2 Type II Evidence Collection',
      type: 'task',
      category: 'SOC 2 Evidence',
      assignee: 'Michael Chen',
      highlight: 'Security controls documentation and testing evidence'
    },
    {
      id: 'DOC-123',
      title: 'Risk Assessment Framework Document',
      type: 'document',
      category: 'Vendor Assessments',
      assignee: 'Emily Rodriguez',
      highlight: 'Comprehensive risk evaluation methodology for third-party vendors'
    },
    {
      id: 'CMT-456',
      title: 'Review comment on access control procedures',
      type: 'comment',
      category: 'Access Reviews',
      assignee: 'David Kim',
      highlight: 'Need to update user provisioning workflow for new employees'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(value.toLowerCase()) ||
        result.category.toLowerCase().includes(value.toLowerCase()) ||
        result.assignee.toLowerCase().includes(value.toLowerCase()) ||
        result.highlight.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect(result);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return 'ClipboardDocumentListIcon';
      case 'comment': return 'ChatBubbleLeftIcon';
      case 'document': return 'DocumentTextIcon';
      default: return 'MagnifyingGlassIcon';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'text-primary';
      case 'comment': return 'text-accent';
      case 'document': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tasks, comments, documents... (⌘K)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              onSearch('');
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <Icon name="XMarkIcon" size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-large z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              {results.length} result{results.length > 1 ? 's' : ''} found
            </div>
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultSelect(result)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-150 ${
                  index === selectedIndex ? 'bg-muted' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    name={getTypeIcon(result.type)}
                    size={16}
                    className={`mt-0.5 flex-shrink-0 ${getTypeColor(result.type)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-foreground text-sm truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono ml-2">
                        {result.id}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.assignee}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {result.highlight}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-large z-50">
          <div className="p-8 text-center text-muted-foreground">
            <Icon name="MagnifyingGlassIcon" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found for "{query}"</p>
            <p className="text-xs mt-1">Try searching for task titles, categories, or assignees</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSearch;