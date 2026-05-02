import { TodoLists } from './components/TodoLists/TodoLists';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">📋 Мои списки дел</h1>
      <TodoLists />
    </div>
  );
}

export default App;