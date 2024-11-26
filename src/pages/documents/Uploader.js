import React, { useState, useEffect } from "react";
import ContentUploader from 'box-ui-elements/es/elements/content-uploader';
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

const UploaderContainer = styled.div`
  ${tw`w-full border border-gray-200 rounded-lg mt-4`}
  min-height: 500px;
  height: 80vh;

  .bcu-content-uploader {
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

const RetryButton = tw.button`
  mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
`;

export default function UploaderPage() {
  const { boxToken, folderData, isLoading, error: authError } = useBoxAuth();
  const [uploadError, setUploadError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    return () => {
      setUploadError(null);
    };
  }, []);

  const handleRetry = () => {
    setUploadError(null);
    setRetryCount(prev => prev + 1);
  };

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

    if (!folderData?.uploadsFolder) {
      return (
        <ErrorContainer>
          <ErrorTitle>Configuration Error</ErrorTitle>
          <ErrorMessage>Upload folder not configured for your account</ErrorMessage>
          <ErrorHint>Please contact your administrator to set up folder access.</ErrorHint>
        </ErrorContainer>
      );
    }

    if (uploadError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Upload Error</ErrorTitle>
          <ErrorMessage>{uploadError}</ErrorMessage>
          <ErrorHint>
            There was an error initializing the uploader. Please try again or contact support if the problem persists.
          </ErrorHint>
          <RetryButton onClick={handleRetry}>
            Try Again
          </RetryButton>
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
            <LoadingScreen message="Loading uploader" />
          ) : (
            <>
              {renderError()}
              {boxToken && folderData?.uploadsFolder && !uploadError && (
                <UploaderContainer>
                  <IntlProvider locale="en">
                    <ContentUploader
                      key={`uploader-${retryCount}`}
                      language="en-US"
                      token={boxToken}
                      rootFolderId={folderData.uploadsFolder}
                      className="uploader-element"
                      onError={(err) => {
                        console.error('Box Content Uploader Error:', err);
                        setUploadError(err.message || 'Error initializing uploader');
                      }}
                      onUploadError={(err) => {
                        console.error('File Upload Error:', err);
                        setUploadError(`Upload failed: ${err.message || 'Unknown error'}`);
                      }}
                      onComplete={() => {
                        console.log('Upload completed successfully');
                        setUploadError(null);
                      }}
                      isResumableUploadsEnabled={true}
                      fileLimit={100}
                      maxFileSize={50000000}
                      contentUploaderProps={{
                        showUploadButton: true,
                        useUploadsManager: true,
                        isFolderUploadEnabled: true
                      }}
                    />
                  </IntlProvider>
                </UploaderContainer>
              )}
            </>
          )}
        </ContentContainer>
      </AnimationRevealPage>
    </>
  );
}