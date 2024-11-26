import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import GlobalStyles from './assets/styles/GlobalStyles';
import LoginPage from './pages/auth/Login.js';
import LoadingScreen from './components/layout/Loading';

// Lazy load other components
const FolderPage = React.lazy(() => import('./pages/documents/Folder.js'));
const PreviewPage = React.lazy(() => import('./pages/documents/Preview.js'));
const UploadPage = React.lazy(() => import('./pages/documents/Uploader.js'));
const LandingPage = React.lazy(() => import('./pages/Home.js'));
const LogoutPage = React.lazy(() => import('./pages/auth/Logout.js'));
const VerificationPage = React.lazy(() => import('./pages/auth/Verification.js'));

// Protected Route Component
const ProtectedRoute = ({ children, ...rest }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Verifying authentication" />;
  }

  // Add this check
  if (isAuthenticated && !user?.email_verified) {
    return <Redirect to="/verify-email" />;
  }

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

const AppContent = () => {
  const { isLoading: isAuth0Loading, isAuthenticated } = useAuth0();
  const [config, setConfig] = useState(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const stored = sessionStorage.getItem('configData');
        if (stored) {
          setConfig(JSON.parse(stored));
        } else {
          const response = await fetch('/config.json');
          const data = await response.json();
          sessionStorage.setItem('configData', JSON.stringify(data));
          setConfig(data);
        }
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setIsConfigLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (isAuth0Loading || isConfigLoading) {
    return <LoadingScreen message="Initializing your experience" />;
  }

  if (!config) {
    return <div>Error loading configuration</div>;
  }

  return (
    <Suspense fallback={<LoadingScreen message="Loading page" />}>
      <Switch>
        {/* Public routes */}
        <Route exact path="/login">
          {isAuthenticated ? <Redirect to="/" /> : <LoginPage />}
        </Route>
        
        <Route exact path="/logout" component={LogoutPage} />

        {/* Verification Route */}
        <Route exact path="/verify-email" component={VerificationPage} />

        {/* Protected routes */}
        <ProtectedRoute exact path="/">
          <LandingPage />
        </ProtectedRoute>

        <ProtectedRoute exact path="/index">
          <LandingPage />
        </ProtectedRoute>

        <ProtectedRoute exact path="/PreviewPage">
          <PreviewPage />
        </ProtectedRoute>

        <ProtectedRoute exact path="/UploaderPage">
          <UploadPage />
        </ProtectedRoute>

        <ProtectedRoute exact path="/FolderPage">
          <FolderPage />
        </ProtectedRoute>

        {/* Catch all route */}
        <Route path="*">
          <Redirect to={isAuthenticated ? "/" : "/login"} />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}