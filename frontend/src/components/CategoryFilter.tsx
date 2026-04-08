import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/BookAPI';

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function CategoryFilter({ selectedCategory, onCategoryChange }: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <div className="list-group">
      <button
        className={`list-group-item list-group-item-action ${!selectedCategory ? 'active' : ''}`}
        onClick={() => onCategoryChange('')}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
