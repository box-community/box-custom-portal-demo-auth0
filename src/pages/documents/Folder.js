import React, { useState, useEffect } from "react";
import ContentExplorer from 'box-ui-elements/es/elements/content-explorer';
import { IntlProvider } from "react-intl";
import AnimationRevealPage from '../../lib/animations/AnimationRevealPage';
import tw from 'twin.macro';
import styled from 'styled-components';
import Header from "../../components/layout/Header";
import { useBoxAuth } from '../../hooks/useBoxAuth';
import LoadingScreen from '../../components/layout/Loading';
import logoURL from "../../assets/images/platform/logo.png";

const ContentContainer = styled.div`
  ${tw`w-full max-w-screen-xl mx-auto p-4`}
`;

const ErrorContainer = styled.div`
  ${tw`max-w-2xl mx-auto my-8 p-6 rounded-lg bg-red-500 border border-red-200`}
`;

const ErrorTitle = tw.h3`text-lg font-semibold text-red-800 mb-2`;
const ErrorMessage = tw.p`text-red-600`;
const ErrorHint = tw.p`mt-4 text-sm text-red-500`;

const BoxContent = styled.div`
  height: calc(100vh - 200px);
  min-height: 400px;

  .bce-content-explorer {
    height: 100%;
  }
`;

export default function FolderPage() {
  const { boxToken, folderData, isLoading, error: authError } = useBoxAuth();
  const [contentError, setContentError] = useState(null);

  useEffect(() => {
    return () => {
      setContentError(null);
    };
  }, []);

  const renderError = () => {
    if (authError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Authentication Error</ErrorTitle>
          <ErrorMessage>{authError}</ErrorMessage>
          <ErrorHint>Please try logging out and back in. If the problem persists, contact support.</ErrorHint>
        </ErrorContainer>
      );
    }

    if (!folderData?.statementsFolder) {
      return (
        <ErrorContainer>
          <ErrorTitle>Configuration Error</ErrorTitle>
          <ErrorMessage>Statements folder not configured for your account</ErrorMessage>
          <ErrorHint>Please contact your administrator to set up folder access.</ErrorHint>
        </ErrorContainer>
      );
    }

    if (contentError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Content Loading Error</ErrorTitle>
          <ErrorMessage>{contentError}</ErrorMessage>
          <ErrorHint>Please refresh the page or try again later.</ErrorHint>
        </ErrorContainer>
      );
    }

    return null;
  };

  return (
    <>
      <Header />
      <AnimationRevealPage>
        <ContentContainer>
          {isLoading && <LoadingScreen message="Loading your statements folder" />}
          {renderError()}
          
          {boxToken && folderData?.statementsFolder && !contentError && (
            <BoxContent>
              <IntlProvider locale="en">
                <ContentExplorer 
                  language='en-US'
                  logoUrl={logoURL}
                  token={boxToken}
                  rootFolderId={folderData.statementsFolder}
                  canUpload={false}
                  canCreateNewFolder={false}
                  canRename={false}
                  onError={(err) => {
                    console.error('Box Content Explorer Error:', err);
                    setContentError(err.message || 'Error loading content');
                  }}
                  contentPreviewProps={{
                    contentSidebarProps: {
                      hasActivityFeed: false,
                      hasSkills: false,
                      hasMetadata: false,
                      detailsSidebarProps: {
                        hasProperties: false,
                        hasNotices: false,
                        hasAccessStats: false,
                        hasVersions: false,
                      },
                    },
                  }}
                />
              </IntlProvider>
            </BoxContent>
          )}
        </ContentContainer>
      </AnimationRevealPage>
    </>
  );
}