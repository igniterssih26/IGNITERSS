import React, { useState } from 'react';
import { SystemStatusBar } from './components/common/SystemStatusBar';
import { RailwayHeader } from './components/common/RailwayHeader';
import { RailwayFooter } from './components/common/RailwayFooter';
import { Panel1DepartmentPortal } from './components/panel1_department/Panel1DepartmentPortal';
import { Panel2IntelligenceHub } from './components/panel2_intelligence/Panel2IntelligenceHub';
import { Panel3AuthoritySignOff } from './components/panel3_authority/Panel3AuthoritySignOff';
import { Panel4StationHistory } from './components/panel4_history/Panel4StationHistory';
import { DataManagementHub } from './components/data_management/DataManagementHub';
import { DemoGuideRunner } from './components/demo_guide/DemoGuideRunner';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('panel2');
  const [userRole, setUserRole] = useState<string>('PLANNER');

  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
    if (newRole === 'DEPARTMENT') setActiveTab('panel1');
    else if (newRole === 'PLANNER') setActiveTab('panel2');
    else if (newRole === 'AUTHORITY') setActiveTab('panel3');
    else if (newRole === 'HISTORIAN') setActiveTab('panel4');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Live Telemetry & Synchronization Status Bar */}
      <SystemStatusBar />

      {/* 2. Top Navigation & Indian Railways Branding Header */}
      <RailwayHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={handleRoleChange}
        pendingNoticeCount={4}
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'panel1' && (
          <Panel1DepartmentPortal onPlanCreated={() => setActiveTab('panel2')} />
        )}

        {activeTab === 'panel2' && (
          <Panel2IntelligenceHub onNavigateToAuthority={() => setActiveTab('panel3')} />
        )}

        {activeTab === 'panel3' && (
          <Panel3AuthoritySignOff onMaintenanceCompleted={() => setActiveTab('panel4')} />
        )}

        {activeTab === 'panel4' && (
          <Panel4StationHistory />
        )}

        {activeTab === 'data' && (
          <DataManagementHub />
        )}

        {activeTab === 'demo' && (
          <DemoGuideRunner
            onNavigateTab={(tab) => setActiveTab(tab)}
            onRefreshAll={() => {}}
          />
        )}
      </main>

      {/* 4. CRIS FOIS Gateway Telemetry Footer */}
      <RailwayFooter />
    </div>
  );
};

export default App;
