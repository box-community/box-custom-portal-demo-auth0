import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import AnimationRevealPage from "../../lib/animations/AnimationRevealPage.js";
import LoadingScreen from '../../components/layout/Loading';
import FinancialDashboard from '../../components/features/dashboard/FinancialDashboard';
import Header from "../../components/layout/Header";
import tw from 'twin.macro';
import styled from 'styled-components';
import { CheckCircle } from 'lucide-react';

const SuccessAlert = styled.div`
  ${tw`max-w-4xl mx-auto mt-4 mb-4 bg-green-500 rounded-lg p-4`}
`;

const AlertContent = styled.div`
  ${tw`flex items-center`}
`;

const IconContainer = styled.div`
  ${tw`flex-shrink-0 text-green-400`}
`;

const AlertText = styled.p`
  ${tw`ml-3 text-sm font-medium text-green-800`}
`;

export default function LoginPage() {
  const { isLoading } = useAuth0();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showVerificationSuccess = searchParams.get('success') === 'true' && 
                                searchParams.get('message')?.includes('verified');

  if (isLoading) {
    return <LoadingScreen message="Preparing login..." />;
  }

  return (
    <AnimationRevealPage>
      <Header />
      {showVerificationSuccess && (
        <SuccessAlert role="alert">
          <AlertContent>
            <IconContainer>
              <CheckCircle size={20} />
            </IconContainer>
            <AlertText>
              Email verified successfully! You can now log in to access all features.
            </AlertText>
          </AlertContent>
        </SuccessAlert>
      )}
      <FinancialDashboard />
    </AnimationRevealPage>
  );
}