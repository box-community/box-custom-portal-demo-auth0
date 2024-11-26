import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AnimationRevealPage from '../lib/animations/AnimationRevealPage';
import Header from "../components/layout/Header";
import FinancialDashboard from "../components/features/dashboard/FinancialDashboard";
import LoadingScreen from '../components/layout/Loading';

export default function LandingPage() {
  const { isLoading } = useAuth0();

  // Don't check for config here since we already have it in App.js
  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard" />;
  }

  return (
    <AnimationRevealPage>
      <Header />
      <FinancialDashboard />
    </AnimationRevealPage>
  );
}