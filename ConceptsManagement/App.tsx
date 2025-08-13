import { AppHeader } from "./components/AppHeader";
import { ConceptDetailPage } from "./components/ConceptDetailPage";

export default function App() {
  return (
    <div className="bg-background">
      <AppHeader />
      <ConceptDetailPage />
    </div>
  );
}