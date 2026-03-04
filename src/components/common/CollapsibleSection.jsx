import { useState } from 'react';
import './CollapsibleSection.css';

function CollapsibleSection({ title, icon, children, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`collapsible-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="section-header" onClick={toggleSection}>
        <h3 className="section-title">
          {icon && <span className="section-icon">{icon}</span>}
          {title}
          <span className="toggle-indicator">{isExpanded ? '▲' : '▼'}</span>
        </h3>
      </div>
      
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}

export default CollapsibleSection;