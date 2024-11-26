import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import AnimationRevealPage from "../../lib/animations/AnimationRevealPage.js";
import tw from 'twin.macro';
import Header from "../../components/layout/Header";
import { Mail } from 'lucide-react';

const Container = tw.div`min-h-screen bg-gray-100`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;
const Card = tw.div`bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center`;
const IconContainer = tw.div`mx-auto w-16 h-16 mb-6 text-blue-600`;
const Title = tw.h2`text-2xl font-bold mb-4 text-gray-900`;
const Message = tw.p`text-gray-600 mb-6`;
const StepNumber = tw.span`inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-2`;
const StepText = tw.p`text-gray-600 mb-4`;

export default function VerificationPage() {
  const { user } = useAuth0();

  return (
    <>
      <Header />
      <AnimationRevealPage>
        <Container>
          <Content>
            <Card>
              <IconContainer>
                <Mail size={64} />
              </IconContainer>
              <Title>Check Your Email</Title>
              <Message>
                A verification link has been sent to <strong>{user?.email}</strong>
              </Message>
              
              <div className="mt-8 text-left">
                <StepNumber>1</StepNumber>
                <StepText>
                  Check your email inbox (and spam folder) for the verification link
                </StepText>
                
                <StepNumber>2</StepNumber>
                <StepText>
                  Click the verification link in the email
                </StepText>
                
                <StepNumber>3</StepNumber>
                <StepText>
                  After verification, close this tab and log in again
                </StepText>
              </div>
            </Card>
          </Content>
        </Container>
      </AnimationRevealPage>
    </>
  );
}