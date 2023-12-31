import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './ParentNavigation';
import DashboardScreen from './screens/DashboardScreen';
import PurchasesRoutes from './screens/Purchases/PurchaseRoutes';
import SalesRoutes from './screens/Sales/SalesRoutes';
import InventoryRoutes from './screens/Inventory/InventoryRoutes';
import SalesCollectionRoutes from './screens/SalesCollection/SalesCollectionRoutes';
import PartiesRoutes from './screens/Parties/PartiesRoutes';
import FinancialRoutes from './screens/financial/FinancialRoutes';
import EmployeeRoutes from './screens/employee/EmployeeRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation />} >
          <Route path="/" element={<DashboardScreen />} />
          <Route path="purchases/*" element={<PurchasesRoutes />} />
          <Route path="sales/*" element={<SalesRoutes />} />
          <Route path="inventory/*" element={<InventoryRoutes />} />
          <Route path="parties/*" element={<PartiesRoutes />} />
          <Route path="collection/*" element={<SalesCollectionRoutes />} />
          <Route path="financials/*" element={<FinancialRoutes/>}/>
          <Route path="employees/*" element={<EmployeeRoutes/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;