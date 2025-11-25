import React from 'react';
import { ProcessedVariation } from '../../types';
import styles from './Controls.module.css';

interface VariationsSelectorProps {
  variations: ProcessedVariation[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const VariationsSelector: React.FC<VariationsSelectorProps> = ({
  variations,
  selectedIds,
  onSelectionChange,
}) => {
  const handleToggle = (variationId: string) => {
    if (selectedIds.length === 1 && selectedIds.includes(variationId)) {
      // Don't allow deselecting the last variation
      return;
    }

    if (selectedIds.includes(variationId)) {
      onSelectionChange(selectedIds.filter((id) => id !== variationId));
    } else {
      onSelectionChange([...selectedIds, variationId]);
    }
  };

  return (
    <div className={styles.selector}>
      <label className={styles.selectorLabel}>Variations:</label>
      <div className={styles.checkboxGroup}>
        {variations.map((variation) => (
          <label key={variation.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedIds.includes(variation.id)}
              onChange={() => handleToggle(variation.id)}
              className={styles.checkbox}
            />
            <span
              className={styles.colorIndicator}
              style={{ backgroundColor: variation.color }}
            />
            <span className={styles.variationName}>{variation.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default VariationsSelector;

