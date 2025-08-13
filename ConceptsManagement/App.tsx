import { TopNavigation } from './components/TopNavigation';
import { ConceptManagement } from './components/ConceptManagement';

export default function App() {
  return (
    <div className="size-full flex flex-col">
      <TopNavigation />
      <div className="flex-1">
        <ConceptManagement />
      </div>
    </div>
  );
}