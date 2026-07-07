"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/application/store";
import Layout from "@/presentation/components/Layout";
import Dashboard from "@/presentation/components/Dashboard";
import Orders from "@/presentation/components/Orders";
import Customers from "@/presentation/components/Customers";
import Transports from "@/presentation/components/Transports";
import Items from "@/presentation/components/Items";
import AuditLogs from "@/presentation/components/AuditLogs";
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
