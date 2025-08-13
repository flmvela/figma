import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ConceptTree } from './ConceptTree';
import { ChangeParentDialog } from './ChangeParentDialog';
import { RelationshipsPanel } from './RelationshipsPanel';
import { 
  Settings, 
  Plus, 
  MoreHorizontal,
  Search,
  List,
  Lightbulb,
  RefreshCw,
  Download
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

export interface Concept {
  id: string;
  name: string;
  level: number;
  description?: string;
  parentId?: string;
  children: string[];
  status: 'approved' | 'suggested' | 'rejected';
  relationships: { conceptId: string; type: 'prerequisite' | 'related' }[];
}

// Mock data matching the music theory concepts from the image
const mockConcepts: Concept[] = [
  {
    id: '1',
    name: 'I. Harmony',
    level: 0,
    description: 'Chord progressions and harmonic relationships',
    children: ['7', '8', '9'],
    status: 'approved',
    relationships: []
  },
  {
    id: '2',
    name: 'II. Rhythm',
    level: 0,
    description: 'Time signatures, beat patterns and rhythmic concepts',
    children: ['10', '11'],
    status: 'approved',
    relationships: []
  },
  {
    id: '3',
    name: 'III. Improvisation',
    level: 0,
    description: 'Spontaneous musical creation and performance',
    children: ['12', '13', '14', '15'],
    status: 'approved',
    relationships: []
  },
  {
    id: '4',
    name: 'IV. Ear Training',
    level: 0,
    description: 'Development of musical listening and recognition skills',
    children: ['16', '17', '18'],
    status: 'approved',
    relationships: []
  },
  {
    id: '5',
    name: 'V. Re-harmonization',
    level: 0,
    description: 'Changing chord progressions while maintaining melody',
    children: ['19', '20', '21'],
    status: 'approved',
    relationships: []
  },
  {
    id: '6',
    name: 'VI. Performance Contexts',
    level: 0,
    description: 'Different settings and styles of musical performance',
    children: ['22', '23', '24'],
    status: 'approved',
    relationships: []
  },
  // Child concepts for demonstration
  {
    id: '7',
    name: 'Scale-Chord Relationships',
    level: 1,
    description: 'Matching scales to chord types',
    parentId: '1',
    children: ['25', '26'],
    status: 'approved',
    relationships: []
  },
  {
    id: '8',
    name: 'Bebop Scales',
    level: 1,
    description: 'Adding chromatic passing tones for linear improvisation',
    parentId: '1',
    children: [],
    status: 'approved',
    relationships: []
  },
  {
    id: '9',
    name: 'Pentatonic Applications',
    level: 1,
    description: 'Using pentatonic scales in jazz contexts',
    parentId: '1',
    children: [],
    status: 'approved',
    relationships: []
  },
  {
    id: '25',
    name: 'Major Scale Modes',
    level: 2,
    description: 'Seven modes of the major scale',
    parentId: '7',
    children: [],
    status: 'approved',
    relationships: []
  },
  {
    id: '26',
    name: 'Melodic Minor Applications',
    level: 2,
    description: 'Using melodic minor and its modes',
    parentId: '7',
    children: [],
    status: 'suggested',
    relationships: []
  }
];

export function ConceptManagement() {
  const [concepts, setConcepts] = useState<Concept[]>(mockConcepts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suggested' | 'rejected'>('active');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5', '6', '7']));
  const [changeParentDialog, setChangeParentDialog] = useState<{ open: boolean; conceptId?: string }>({ open: false });
  const [relationshipsPanel, setRelationshipsPanel] = useState<{ open: boolean; conceptId?: string }>({ open: false });
  const [inlineEditingParent, setInlineEditingParent] = useState<string | null>(null);

  const filteredConcepts = useMemo(() => {
    return concepts.filter(concept => {
      const matchesSearch = concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (concept.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && concept.status === 'approved') ||
                          (filterStatus === 'suggested' && concept.status === 'suggested') ||
                          (filterStatus === 'rejected' && concept.status === 'rejected');
      
      return matchesSearch && matchesFilter;
    });
  }, [concepts, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = concepts.length;
    const suggested = concepts.filter(c => c.status === 'suggested').length;
    const approved = concepts.filter(c => c.status === 'approved').length;
    const rejected = concepts.filter(c => c.status === 'rejected').length;
    return { total, suggested, approved, rejected };
  }, [concepts]);

  const handleChangeParent = (conceptId: string, newParentId?: string) => {
    setConcepts(prevConcepts => {
      return prevConcepts.map(concept => {
        if (concept.id === conceptId) {
          const oldParentId = concept.parentId;
          
          // Update the concept's parent
          const updatedConcept = { 
            ...concept, 
            parentId: newParentId,
            level: newParentId ? (prevConcepts.find(p => p.id === newParentId)?.level ?? 0) + 1 : 0
          };
          
          return updatedConcept;
        }
        
        // Remove from old parent's children
        if (concept.children.includes(conceptId)) {
          return {
            ...concept,
            children: concept.children.filter(childId => childId !== conceptId)
          };
        }
        
        // Add to new parent's children
        if (concept.id === newParentId && !concept.children.includes(conceptId)) {
          return {
            ...concept,
            children: [...concept.children, conceptId]
          };
        }
        
        return concept;
      });
    });
  };

  const handleDeleteConcept = (conceptId: string) => {
    setConcepts(prevConcepts => {
      return prevConcepts.filter(concept => {
        if (concept.id === conceptId) return false;
        
        // Remove from parent's children
        if (concept.children.includes(conceptId)) {
          concept.children = concept.children.filter(childId => childId !== conceptId);
        }
        
        return true;
      });
    });
  };

  const handleAddChild = (parentId: string) => {
    // Cancel any existing inline editing
    setInlineEditingParent(null);
    
    // Start inline editing for this parent
    setInlineEditingParent(parentId);
    
    // Expand the parent node
    setExpandedNodes(prev => new Set([...prev, parentId]));
  };

  const handleAddRootConcept = () => {
    // Cancel any existing inline editing
    setInlineEditingParent(null);
    
    // Start inline editing for root level
    setInlineEditingParent('root');
  };

  const handleSaveInlineEdit = (parentId: string | null, name: string) => {
    const newId = Date.now().toString();
    const parent = parentId ? concepts.find(c => c.id === parentId) : undefined;
    
    const newConcept: Concept = {
      id: newId,
      name: name,
      description: undefined,
      level: parent ? parent.level + 1 : 0,
      parentId: parentId || undefined,
      children: [],
      status: 'suggested',
      relationships: []
    };

    setConcepts(prev => [
      ...prev,
      newConcept
    ]);

    // Add to parent's children if there's a parent
    if (parentId && parentId !== 'root') {
      setConcepts(prev => prev.map(concept => 
        concept.id === parentId 
          ? { ...concept, children: [...concept.children, newId] }
          : concept
      ));
    }

    // Clear inline editing state
    setInlineEditingParent(null);
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingParent(null);
  };

  const handleGenerateAIStructure = () => {
    console.log('Generate AI Structure clicked');
    // Add your AI structure generation logic here
  };

  const handleReimportMasterConcepts = () => {
    console.log('Re-import Master Concepts clicked');
    // Add your re-import logic here
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold">Concept Management</h1>
            
            {/* Stats Bar - Updated to match image layout */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Active Concepts</span>
                <span className="font-medium">({stats.approved})</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">AI Suggested</span>
                <span className="font-medium">({stats.suggested})</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground italic">
              Showing first 50 of {filteredConcepts.length} concepts. Use search/filters to find specific concepts.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleAddRootConcept}>
              <Plus className="h-4 w-4 mr-2" />
              Add Concept
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleGenerateAIStructure}>
                  <Settings className="h-4 w-4 mr-2" />
                  Generate AI Structure
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReimportMasterConcepts}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-import Master Concepts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="border-b bg-card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suggested">Suggested</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Concept Tree */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <ConceptTree
          concepts={filteredConcepts}
          allConcepts={concepts}
          expandedNodes={expandedNodes}
          inlineEditingParent={inlineEditingParent}
          onToggleExpand={(nodeId) => {
            setExpandedNodes(prev => {
              const newSet = new Set(prev);
              if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
              } else {
                newSet.add(nodeId);
              }
              return newSet;
            });
          }}
          onChangeParent={(conceptId) => setChangeParentDialog({ open: true, conceptId })}
          onManageRelationships={(conceptId) => setRelationshipsPanel({ open: true, conceptId })}
          onAddChild={handleAddChild}
          onDelete={handleDeleteConcept}
          onSaveInlineEdit={handleSaveInlineEdit}
          onCancelInlineEdit={handleCancelInlineEdit}
        />
      </div>

      {/* Dialogs */}
      <ChangeParentDialog
        open={changeParentDialog.open}
        onOpenChange={(open) => setChangeParentDialog({ open })}
        conceptId={changeParentDialog.conceptId}
        concepts={concepts}
        onChangeParent={handleChangeParent}
      />

      <RelationshipsPanel
        open={relationshipsPanel.open}
        onOpenChange={(open) => setRelationshipsPanel({ open })}
        conceptId={relationshipsPanel.conceptId}
        concepts={concepts}
        onUpdateRelationships={(conceptId, relationships) => {
          setConcepts(prev => prev.map(concept => 
            concept.id === conceptId 
              ? { ...concept, relationships }
              : concept
          ));
        }}
      />
    </div>
  );
}