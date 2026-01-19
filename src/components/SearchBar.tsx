import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SearchBar: React.FC = () => {
  const { t } = useLanguage();
  const pages = (t('pages') as Array<{ label: string; path: string }>) || []; 
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return pages.filter(p => p.label.toLowerCase().includes(q));
  }, [query, pages]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      navigate(results[0].path);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2">
        <Input
          id="global-search"
          ref={inputRef}
          placeholder={t('search_placeholder') ?? 'Buscar'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t('search_placeholder')}
          className="w-full"
        />
        <Button variant="ghost" onClick={() => { inputRef.current?.focus(); }} aria-label="Focus search">/</Button>
      </div>

      {results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-popover border rounded-md shadow-md">
          {results.map(r => (
            <li key={r.path} className="px-3 py-2 hover:bg-muted cursor-pointer" onMouseDown={() => { navigate(r.path); setQuery(''); }}>
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
