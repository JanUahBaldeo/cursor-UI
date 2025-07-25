// components/TagInput.jsx
import { useState, useEffect, useContext } from 'react';
import { X, Tag, User, AlertTriangle } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';

const iconMap = {
  Urgent: <AlertTriangle size={12} className="text-red-500" />,
  Client: <User size={12} className="text-blue-500" />,
  Internal: <Tag size={12} className="text-gray-400" />,
};

const groupedOptions = [
  { label: 'Priority', tags: ['Urgent'] },
  { label: 'Audience', tags: ['Client', 'Internal'] },
  { label: 'Type', tags: ['Feature', 'Bug', 'Improvement'] },
];

const TagInput = ({ value = [], onChange, options = [], max = 5, readOnly = false }) => {
  const { tagsFromBackend = [] } = useContext(TaskContext);
  const [input, setInput] = useState('');
  const [dynamicTags, setDynamicTags] = useState([]);

  const tags = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',').map((t) => ({ label: t.trim(), value: t.trim() }))
      : [];

  useEffect(() => {
    if (tagsFromBackend?.length) {
      setDynamicTags(tagsFromBackend);
    }
  }, [tagsFromBackend]);

  const addTag = (tag) => {
    const newTag = { label: tag, value: tag };
    if (!tags.some(t => t.value === tag) && tags.length < max) {
      onChange([...tags, newTag]);
    }
    setInput('');
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((t) => t.value !== tagToRemove.value);
    onChange(newTags);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-teal-100 dark:bg-teal-700 text-teal-900 dark:text-white animate-fade-in"
            title={`Tag: ${tag.label}`}
          >
            {iconMap[tag.label] || <Tag size={12} />} {tag.label}
            {!readOnly && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-600"
              >
                <X size={12} />
              </button>
            )}
          </span>
        ))}
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Add tag..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (input.trim()) addTag(input.trim());
              }
            }}
            disabled={tags.length >= max}
          />

          <select
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
            onChange={(e) => {
              if (e.target.value) addTag(e.target.value);
            }}
            value=""
            disabled={tags.length >= max}
          >
            <option value="">+ From list</option>
            {[...new Set([...options, ...dynamicTags])]
              .filter((opt) => !tags.some(t => t.value === opt))
              .map((opt, i) => (
                <option key={i} value={opt} title={`Tag: ${opt}`}>
                  {opt}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TagInput; 