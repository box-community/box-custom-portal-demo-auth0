import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AnimationRevealPage from "../../lib/animations/AnimationRevealPage.js";
import tw from 'twin.macro';
import { Container as ContainerBase } from "../../components/layout/Layouts/index.js";

const Container = tw(ContainerBase)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;

export default () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ returnTo: window.location.origin });
  }, [logout]);

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <MainContent>
              <Heading>Signing you out...</Heading>
            </MainContent>
          </MainContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};