import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import tw, { styled } from 'twin.macro';
import { ReactComponent as MenuIcon } from 'feather-icons/dist/icons/menu.svg';
import { ReactComponent as CloseIcon } from 'feather-icons/dist/icons/x.svg';
import { ReactComponent as UserIcon } from 'feather-icons/dist/icons/user.svg';
import { getConfigValues } from "../../../lib/utils/helper";
import useAnimatedNavToggler from "../../../hooks/useAnimatedNavToggler.js";

const HeaderContainer = tw.header`
  flex
  items-center
  justify-between
  max-w-4xl
  mx-auto
  py-4
  px-4
`;

const NavContainer = tw.div`
  flex
  justify-between
  items-center
  w-full
`;

const LogoContainer = tw.div`
  flex
  items-center
`;

const LogoLink = tw.a`
  flex
  items-center
  font-bold
  text-2xl
  text-blue-600
  no-underline
  hover:text-blue-700
  transition-colors
`;

const NavLinksContainer = tw.div`
  hidden
  md:flex
  items-center
  space-x-8
`;

const NavLink = styled.a`
  ${tw`
    text-base
    font-medium
    text-gray-600
    cursor-pointer
    transition-colors
    hover:text-blue-600
    no-underline
  `}
  ${props => props.isActive && tw`text-blue-600`}
`;

const AuthButton = styled.button`
  ${tw`
    flex
    items-center
    px-4
    py-2
    font-medium
    text-white
    bg-blue-600
    rounded
    hover:bg-blue-700
    transition-colors
  `}
`;

const MobileNavButton = tw.button`
  md:hidden
  p-2
  rounded
  text-gray-600
  hover:text-blue-600
  transition-colors
  focus:outline-none
`;

const MobileNavContainer = styled.div`
  ${tw`
    fixed
    inset-0
    z-50
    md:hidden
    bg-white
    transform
    transition-transform
    duration-300
    ease-in-out
  `}
  ${props => props.isOpen ? tw`translate-x-0` : tw`translate-x-full`}
`;

const MobileNavContent = tw.div`
  flex
  flex-col
  h-full
  p-4
`;

const MobileNavHeader = tw.div`
  flex
  items-center
  justify-between
  mb-8
`;

const MobileNavLinks = tw.div`
  flex
  flex-col
  space-y-4
`;

export default function Header() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const location = useLocation();
  const history = useHistory();
  const { showNavLinks, toggleNavbar } = useAnimatedNavToggler();
  
  // Get navigation from config and ensure it's an array
  const configData = getConfigValues('navigation');
  const navigation = Array.isArray(configData) ? configData : [];

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      loginWithRedirect();
    }
  };

  const handleNavClick = (path) => {
    history.push(`/${path}`);
    if (showNavLinks) {
      toggleNavbar();
    }
  };

  const isActivePath = (path) => {
    return location.pathname === `/${path}`;
  };

  // Check if email is verified
  const isEmailVerified = user?.email_verified;

  return (
    <HeaderContainer>
      <NavContainer>
        <LogoContainer>
          <LogoLink href="/" onClick={(e) => { e.preventDefault(); history.push('/'); }}>
            Increo Financial
          </LogoLink>
        </LogoContainer>

        {/* Desktop Navigation - Only show nav links if email is verified */}
        <NavLinksContainer>
          {isAuthenticated && isEmailVerified && navigation.map(nav => (
            <NavLink
              key={nav.page}
              onClick={() => handleNavClick(nav.page)}
              isActive={isActivePath(nav.page)}
            >
              {nav.title}
            </NavLink>
          ))}
          <AuthButton onClick={handleAuthClick}>
            <UserIcon size={20} tw="mr-2" />
            {isAuthenticated ? 'Sign Out' : 'Sign In'}
          </AuthButton>
        </NavLinksContainer>

        {/* Mobile Menu Button - Only show if email is verified */}
        {isEmailVerified && (
          <MobileNavButton onClick={toggleNavbar}>
            {showNavLinks ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </MobileNavButton>
        )}
      </NavContainer>

      {/* Mobile Navigation - Only show if email is verified */}
      {isEmailVerified && (
        <MobileNavContainer isOpen={showNavLinks}>
          <MobileNavContent>
            <MobileNavHeader>
              <LogoLink href="/" onClick={(e) => { e.preventDefault(); history.push('/'); }}>
                Increo Financial
              </LogoLink>
              <MobileNavButton onClick={toggleNavbar}>
                <CloseIcon size={24} />
              </MobileNavButton>
            </MobileNavHeader>
            <MobileNavLinks>
              {isAuthenticated && navigation.map(nav => (
                <NavLink
                  key={nav.page}
                  onClick={() => handleNavClick(nav.page)}
                  isActive={isActivePath(nav.page)}
                >
                  {nav.title}
                </NavLink>
              ))}
              <AuthButton onClick={handleAuthClick}>
                <UserIcon size={20} tw="mr-2" />
                {isAuthenticated ? 'Sign Out' : 'Sign In'}
              </AuthButton>
            </MobileNavLinks>
          </MobileNavContent>
        </MobileNavContainer>
      )}
    </HeaderContainer>
  );
}