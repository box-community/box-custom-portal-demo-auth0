import React, { useState, useEffect } from "react";
import ContentPreview from 'box-ui-elements/es/elements/content-preview';
import { IntlProvider } from "react-intl";
import AnimationRevealPage from '../../lib/animations/AnimationRevealPage';
import tw from 'twin.macro';
import styled from 'styled-components';
import Header from "../../components/layout/Header";
import { useBoxAuth } from '../../hooks/useBoxAuth';
import LoadingScreen from '../../components/layout/Loading';

const ContentContainer = styled.div`
  ${tw`w-full max-w-screen-xl mx-auto p-4`}
  min-height: calc(100vh - 100px);
  position: relative;
`;

const PreviewContainer = styled.div`
  ${tw`w-full border border-gray-200 rounded-lg mt-4`}
  height: calc(100vh - 200px);
  min-height: 400px;

  .bp-content-preview {
    height: 100%;
    width: 100%;
  }
`;

const ErrorContainer = styled.div`
  ${tw`max-w-2xl mx-auto my-8 p-6 rounded-lg bg-red-500 border border-red-200`}
`;

const ErrorTitle = tw.h3`text-lg font-semibold text-red-800 mb-2`;
const ErrorMessage = tw.p`text-red-600`;
const ErrorHint = tw.p`mt-4 text-sm text-red-500`;

export default function PreviewPage() {
  const { boxToken, isLoading, error: authError } = useBoxAuth();
  const [previewError, setPreviewError] = useState(null);
  const fileId = process.env.REACT_APP_BOX_PREVIEW_FILE_ID;

  useEffect(() => {
    return () => {
      setPreviewError(null);
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

    if (previewError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Preview Error</ErrorTitle>
          <ErrorMessage>{previewError}</ErrorMessage>
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
          {isLoading ? (
            <LoadingScreen message="Loading preview" />
          ) : (
            <>
              {renderError()}
              {boxToken && !previewError && (
                <PreviewContainer>
                  <IntlProvider locale="en">
                    <ContentPreview
                      hasHeader={true}
                      contentAnswersProps={{
                        show: true,
                      }}
                      token={boxToken}
                      fileId={fileId}
                      onError={(err) => {
                        console.error('Box Preview Error:', err);
                        setPreviewError(err.message || 'Error loading preview');
                      }}
                      contentSidebarProps={{
                        hasActivityFeed: false,
                        hasSkills: false,
                        hasMetadata: false,
                        detailsSidebarProps: {
                          hasProperties: false,
                          hasNotices: false,
                          hasAccessStats: false,
                          hasVersions: false,
                        }
                      }}
                      showDownload={true}
                      skipServerUpdate={true}
                    />
                  </IntlProvider>
                </PreviewContainer>
              )}
            </>
          )}
        </ContentContainer>
      </AnimationRevealPage>
    </>
  );
}