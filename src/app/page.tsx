"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/application/store";
import Layout from "@/presentation/components/Layout";
import Dashboard from "@/presentation/pages/dashboard";
import Orders from "@/presentation/pages/orders";
import Customers from "@/presentation/pages/customers";
import Transports from "@/presentation/pages/transports";
import Items from "@/presentation/pages/items";
import AuditLogs from "@/presentation/pages/audit";
import Toast from "@/presentation/components/Toast";

export default function Home() {
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "customers":
        return <Customers />;
      case "transports":
        return <Transports />;
      case "items":
        return <Items />;
      case "audit":
        return <AuditLogs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderActiveTabContent()}
      <Toast />
    </Layout>
  );
}
