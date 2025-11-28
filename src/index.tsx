import { StrictMode, useState, useEffect } from "react";
import * as ReactDOMClient from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import Sheet from "./Sheet";
import { Tab } from "./Types";
import { saveTemplateToLS, getTabsFromLS, saveTabsToLS, deleteLayoutFromLS } from "./Utils";
import "./Styles/Global.css";

function App() {
  const defaultTabs: Tab[] = [
    { id: "tab-main", label: "Main" }
  ];

  const [editMode, setEditMode] = useState(false);

  const [tabs, setTabs] = useState<Tab[]>(() => {
    const loaded = getTabsFromLS();
    return loaded.length ? loaded : defaultTabs;
  });
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    saveTabsToLS(tabs);
  }, [tabs]);

  // Ensure activeTab is always valid if tabs change
  useEffect(() => {
    if (!tabs.some(t => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id || "");
    }
  }, [tabs, activeTab]);

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  // Add a new tab
  const handleAddTab = () => {
    const base = "tab-";
    const newTab = { id: `${base}${uuidv4()}`, label: `Tab ${tabs.length + 1}` };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  // Delete a tab
  const handleDeleteTab = (id: string) => {
    if (tabs.length === 1) return; // Prevent deleting the last tab
    const tabLabel = tabs.find(t => t.id === id)?.label || "this tab";
    if (!window.confirm(`Are you sure you want to delete '${tabLabel}'?`)) return;
    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    deleteLayoutFromLS(id);
    setTabs(newTabs);
    saveTabsToLS(newTabs);
    // Set active tab to previous or first
    if (activeTab === id) {
      setActiveTab(newTabs[Math.max(0, idx - 1)].id);
    }
  };

  // Rename a tab
  const handleRenameTab = (id: string) => {
    const label = prompt("Enter new tab name:", tabs.find(t => t.id === id)?.label);
    if (label && label.trim()) {
      setTabs(tabs.map(t => t.id === id ? { ...t, label: label.trim() } : t));
    }
  };

  return (
    <div className="sheet-group">
      <Sheet
        key={activeTab}
        tabId={activeTab}
        editMode={editMode}
        toggleEditMode={toggleEditMode}
      />
      <div className="tab-group">
        {tabs.map(tab => (
          <div key={tab.id}>
            <button
              className={`tab-button ${activeTab === tab.id ? "selected" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              onDoubleClick={() => handleRenameTab(tab.id)}
            >
              <span
                id={`tab-close${activeTab !== tab.id ? "-hidden" : ""}`}
                className="remove-button"
                onClick={() => handleDeleteTab(tab.id)}
                title="Delete tab"
              >
                &times;
              </span>
              <span className="tab-button-content">{tab.label}</span>
            </button>
          </div>
        ))}
        <button className="tab-add tab-button" onClick={handleAddTab} title="Add tab">
          +
        </button>
      </div>
    </div>
  );
}

saveTemplateToLS();

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
