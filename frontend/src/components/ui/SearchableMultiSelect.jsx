import { useState, useMemo, useRef, useEffect } from 'react';
import { MdSearch, MdCheck, MdClose, MdChevronRight } from 'react-icons/md';

/**
 * SearchableMultiSelect
 * @param {Array} options - [{ id, label }]
 * @param {Array} selectedIds - [id, id]
 * @param {Function} onChange - (selectedIds) => {}
 * @param {string} placeholder - Placeholder text
 */
export default function SearchableMultiSelect({ options = [], selectedIds = [], onChange, placeholder = "Search...", multi = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const lower = searchTerm.toLowerCase();
    return options.filter(opt => opt.label.toLowerCase().includes(lower));
  }, [options, searchTerm]);

  function toggleOption(id) {
    if (multi) {
      const next = selectedIds.includes(id)
        ? selectedIds.filter(v => v !== id)
        : [...selectedIds, id];
      onChange(next);
    } else {
      onChange(id === selectedIds[0] && selectedIds.length > 0 ? [] : [id]);
      setIsOpen(false);
    }
  }

  const selectedObjects = useMemo(() => 
    options.filter(opt => selectedIds.includes(opt.id)),
  [options, selectedIds]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger / Selected Preview */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[44px] p-2 bg-white border border-gray-200 rounded-lg cursor-pointer flex flex-wrap gap-1.5 items-center hover:border-brand-purple/50 transition-colors shadow-sm"
      >
        {selectedObjects.length === 0 ? (
          <span className="text-gray-400 text-sm ml-2">{placeholder}</span>
        ) : multi ? (
          selectedObjects.map(obj => (
            <span 
              key={obj.id} 
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-brand-purple text-xs font-semibold rounded-md border border-purple-100 animate-in fade-in zoom-in duration-200"
            >
              {obj.label}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleOption(obj.id); }}
                className="hover:bg-purple-200 rounded-full transition-colors"
              >
                <MdClose size={14} />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-800 text-sm font-medium ml-2">{selectedObjects[0].label}</span>
        )}
        <div className="ml-auto pr-1">
          <MdChevronRight 
            size={20} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[1001] top-full left-0 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <MdSearch size={18} className="text-gray-400" />
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs italic">
                No results found
              </div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={(e) => { e.stopPropagation(); toggleOption(opt.id); }}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all
                      ${isSelected ? 'bg-purple-50 text-brand-purple' : 'hover:bg-gray-50 text-gray-700'}
                    `}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                    {isSelected && <MdCheck size={18} className="text-brand-purple animate-in zoom-in" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Summary */}
          {multi && selectedIds.length > 0 && (
            <div className="px-3 py-2 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {selectedIds.length} Selected
              </span>
              <button 
                onClick={() => onChange([])}
                className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-wider transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
