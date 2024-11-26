import React from 'react';
import tw, { styled } from 'twin.macro';
import { ReactComponent as BoxLogo } from "../../../assets/images/platform/logo.svg";

const LoadingContainer = styled.div`
  ${tw`relative w-full`}
  min-height: calc(100vh - 100px);
`;

const LoadingOverlay = styled.div`
  ${tw`absolute inset-0 bg-white opacity-75`}
  z-index: 50;
`;

const LoadingContent = styled.div`
  ${tw`absolute bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center space-y-6`}
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 51;
`;

const LogoContainer = styled.div`
  ${tw`w-16 h-16`}
  svg {
    ${tw`w-full h-full text-blue-600`}
  }
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const Spinner = styled.div`
  ${tw`inline-block`}
  width: 64px;
  height: 64px;

  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #0160D4;
    border-color: #0160D4 transparent #0160D4 transparent;
    animation: spinner 1.2s linear infinite;
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  ${tw`text-lg font-medium text-gray-600`}
`;

export const LoadingScreen = ({ message = "Loading" }) => (
  <LoadingContainer>
    <LoadingOverlay />
    <LoadingContent>
      <LogoContainer>
        <BoxLogo />
      </LogoContainer>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingContent>
  </LoadingContainer>
);

export default LoadingScreen;