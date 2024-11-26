exports.onExecutePostLogin = async function(event, api) {

    try {
        // Skip if user already has complete Box metadata
        if (event.user.user_metadata?.box_user_id && 
            event.user.user_metadata?.statements_folder_id && 
            event.user.user_metadata?.uploads_folder_id) {
            console.log('User already has complete Box metadata');
            return;
        }
  
        console.log('Checking Box user info for:', event.user.email);
        const BoxSDK = require('box-node-sdk');
        
        const privateKey = event.secrets.BOX_PRIVATE_KEY
            .replace(/\\n/g, '\n')
            .trim();
        
        const sdk = new BoxSDK({
            clientID: event.secrets.BOX_CLIENT_ID,
            clientSecret: event.secrets.BOX_CLIENT_SECRET,
            appAuth: {
                keyID: event.secrets.BOX_KEY_ID,
                privateKey: privateKey,
                passphrase: event.secrets.BOX_PASSPHRASE
            }
        });
  
        const serviceClient = sdk.getAppAuthClient('enterprise', event.secrets.BOX_ENTERPRISE_ID);
        
        const users = await serviceClient.enterprise.getUsers({ external_app_user_id: event.user.user_id});
        var boxUser = users.entries[0];
  
        // Create user client to access their folders
        const userClient = sdk.getAppAuthClient('user', boxUser.id);
        const namespace = 'https://your-namespace.com/';
        // Get root folder items
        try {
            const rootItems = await userClient.folders.getItems('0');
          console.log(rootItems);
            const userRootFolder = rootItems.entries.find(item => 
                item.type === 'folder' && item.name === (event.user.email)
            );
  
            if (!userRootFolder) {
                throw new Error('User root folder not found');
            }
  
            console.log('Found user root folder:', userRootFolder.id);
  
            // Get statements folder
            const statementsFolderItems = await userClient.folders.getItems(userRootFolder.id);
            const statementsFolder = statementsFolderItems.entries.find(item =>
                item.type === 'folder' && item.name === 'My Statements'
            );
  
            if (!statementsFolder) {
                throw new Error('Statements folder not found');
            }
  
            console.log('Found statements folder:', statementsFolder.id);
  
            // Get uploads folder
            const uploadsFolderItems = await userClient.folders.getItems(statementsFolder.id);
            const uploadsFolder = uploadsFolderItems.entries.find(item =>
                item.type === 'folder' && item.name === 'Uploads'
            );
  
            if (!uploadsFolder) {
                throw new Error('Uploads folder not found');
            }
  
            console.log('Found uploads folder:', uploadsFolder.id);
  
            // Set app metadata with all IDs
            const metadata = {
                box_app_user_id: boxUser.id,
                root_folder_id: userRootFolder.id,
                statements_folder_id: statementsFolder.id,
                uploads_folder_id: uploadsFolder.id
            };
  
            // Update Auth0 metadata
            api.user.setAppMetadata('box_app_user_id', boxUser.id);
            api.user.setAppMetadata('box_statements_folder_id', statementsFolder.id);
            api.user.setAppMetadata('box_uploads_folder_id', uploadsFolder.id);
  
            // Set custom claims
            Object.entries(metadata).forEach(([key, value]) => {
                api.idToken.setCustomClaim(`${namespace}${key}`, value);
            });
  
            console.log('Successfully synced Box metadata:', metadata);
  
        } catch (error) {
            console.error('Error retrieving folder structure:', error);
            // Still set the box user ID even if folder retrieval fails
            api.user.setAppMetadata('box_app_user_id', boxUser.id);
            api.idToken.setCustomClaim(`${namespace}box_app_user_id`, boxUser.id);
            throw error;
        }
  
    } catch (error) {
        console.error('Error syncing Box metadata:', error);
        
        if (error.response) {
            console.error('Box API Error:', {
                status: error.response.status,
                data: error.response.data
            });
        }
  
        // Don't block login if metadata sync fails
        console.error('Failed to sync Box metadata:', error.message);
    }
  };