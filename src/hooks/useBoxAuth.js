import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useBoxAuth = () => {
  const { getIdTokenClaims, isAuthenticated } = useAuth0();
  const [boxToken, setBoxToken] = useState(null);
  const [folderData, setFolderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBoxToken = useCallback(async (mounted) => {
    if (!isAuthenticated) {
      if (mounted) {
        setError('User not authenticated');
        setIsLoading(false);
      }
      return;
    }

    try {
      // Get token claims
      const claims = await getIdTokenClaims();
      if (!claims || !claims.__raw) {
        throw new Error('Unable to get user authentication details');
      }

      // Decode token and extract data
      const decodedToken = JSON.parse(atob(claims.__raw.split('.')[1]));
      const namespace = 'https://your-namespace.com/';
      const boxAppUserId = decodedToken[`${namespace}box_app_user_id`];
      
      if (!boxAppUserId) {
        throw new Error('Box App User ID not found in user profile');
      }

      // Get folder IDs from claims
      const statementsFolder = decodedToken[`${namespace}statements_folder_id`];
      const uploadsFolder = decodedToken[`${namespace}uploads_folder_id`];
      // Get Box access token
      const response = await fetch(`/api/getBoxToken?box_app_user_id=${encodeURIComponent(boxAppUserId)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get Box access token');
      }
      
      const data = await response.json();
      if (!data.access_token) {
        throw new Error('No access token received from Box');
      }

      // Only update state if component is still mounted
      if (mounted) {
        setBoxToken(data.access_token);
        setFolderData({
          statementsFolder,
          uploadsFolder,
          // Include additional useful data
          hasStatementsAccess: Boolean(statementsFolder),
          hasUploadsAccess: Boolean(uploadsFolder)
        });
        setError(null);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Box authentication error:', err);
      if (mounted) {
        setError(err.message || 'Failed to initialize Box integration');
        setBoxToken(null);
        setFolderData(null);
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, getIdTokenClaims]);

  useEffect(() => {
    let mounted = true;
    getBoxToken(mounted);
    return () => {
      mounted = false;
    };
  }, [getBoxToken]);

  // Return an object with all necessary data and states
  return {
    boxToken,
    folderData,
    isLoading: isLoading && !boxToken,
    error,
    isInitialized: !isLoading,
    hasValidSession: Boolean(boxToken && folderData)
  };
};