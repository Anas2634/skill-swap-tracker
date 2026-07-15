const SkillChip = ({ label, variant = 'teach', removable = false, onRemove }) => (
  <span className={`skill-chip skill-chip--${variant}`}>
    {label}
    {removable && (
      <button type="button" className="skill-chip-remove" onClick={onRemove} aria-label={`Remove ${label}`}>
        ×
      </button>
    )}
  </span>
);

export default SkillChip;
