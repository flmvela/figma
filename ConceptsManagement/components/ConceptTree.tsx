import React from 'react';
import { ConceptNode } from './ConceptNode';
import { InlineConceptEditor } from './InlineConceptEditor';
import { Concept } from './ConceptManagement';

interface ConceptTreeProps {
  concepts: Concept[];
  allConcepts: Concept[];
  expandedNodes: Set<string>;
  inlineEditingParent: string | null;
  onToggleExpand: (nodeId: string) => void;
  onChangeParent: (conceptId: string) => void;
  onManageRelationships: (conceptId: string) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (conceptId: string) => void;
  onSaveInlineEdit: (parentId: string | null, name: string) => void;
  onCancelInlineEdit: () => void;
}

export function ConceptTree({
  concepts,
  allConcepts,
  expandedNodes,
  inlineEditingParent,
  onToggleExpand,
  onChangeParent,
  onManageRelationships,
  onAddChild,
  onDelete,
  onSaveInlineEdit,
  onCancelInlineEdit
}: ConceptTreeProps) {
  // Build tree structure
  const conceptMap = new Map(allConcepts.map(c => [c.id, c]));
  const filteredConceptMap = new Map(concepts.map(c => [c.id, c]));
  
  // Get root concepts (no parent or parent not in filtered set)
  const rootConcepts = concepts.filter(concept => 
    !concept.parentId || !filteredConceptMap.has(concept.parentId)
  );

  const renderConcept = (concept: Concept, level: number = 0): React.ReactNode => {
    const hasChildren = concept.children.some(childId => filteredConceptMap.has(childId));
    const isExpanded = expandedNodes.has(concept.id);
    const isAddingChild = inlineEditingParent === concept.id;
    
    return (
      <div key={concept.id}>
        <div className="border-b border-border/40 last:border-b-0">
          <ConceptNode
            concept={concept}
            level={level}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggleExpand={() => onToggleExpand(concept.id)}
            onChangeParent={() => onChangeParent(concept.id)}
            onManageRelationships={() => onManageRelationships(concept.id)}
            onAddChild={() => onAddChild(concept.id)}
            onDelete={() => onDelete(concept.id)}
          />
        </div>
        
        {/* Render children if expanded */}
        {((hasChildren && isExpanded) || isAddingChild) && (
          <div className="ml-8 border-l border-border/40">
            {/* Existing children */}
            {hasChildren && isExpanded && (
              <>
                {concept.children
                  .map(childId => conceptMap.get(childId))
                  .filter((child): child is Concept => child !== undefined && filteredConceptMap.has(child.id))
                  .map(child => renderConcept(child, level + 1))}
              </>
            )}
            
            {/* Inline editor for new child */}
            {isAddingChild && (
              <div className="border-b border-border/40 last:border-b-0">
                <InlineConceptEditor
                  parentLevel={level}
                  onSave={(name) => onSaveInlineEdit(concept.id, name)}
                  onCancel={onCancelInlineEdit}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (rootConcepts.length === 0 && inlineEditingParent !== 'root') {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No concepts found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Root concepts */}
      {rootConcepts.map(concept => renderConcept(concept))}
      
      {/* Inline editor for new root concept */}
      {inlineEditingParent === 'root' && (
        <div className="border-b border-border/40 last:border-b-0">
          <InlineConceptEditor
            parentLevel={-1}
            onSave={(name) => onSaveInlineEdit(null, name)}
            onCancel={onCancelInlineEdit}
          />
        </div>
      )}
    </div>
  );
}