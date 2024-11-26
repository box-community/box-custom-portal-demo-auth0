const BoxSDK = require('box-node-sdk');

module.exports = async (req, res) => {
  try {
    const boxAppUserId = req.query.box_app_user_id;

    if (!boxAppUserId) {
      return res.status(400).json({ error: 'Missing box_app_user_id parameter' });
    }

    // Initialize the Box SDK
    const sdk = new BoxSDK({
      clientID: process.env.BOX_CLIENT_ID,
      clientSecret: process.env.BOX_CLIENT_SECRET,
      appAuth: {
        keyID: process.env.BOX_PUBLIC_KEY_ID,
        privateKey: process.env.BOX_PRIVATE_KEY.replace(/\\n/g, '\n'),
        passphrase: process.env.BOX_PASSPHRASE
      }
    });

    const client = sdk.getAppAuthClient('user', boxAppUserId);
    
    // Get user token with the correct scopes
    const tokenInfo = await client.exchangeToken(['base_explorer', 'base_upload', 'item_preview', 'item_download', 'item_upload', 'ai.readwrite']);

    res.status(200).json({ 
      access_token: tokenInfo.accessToken,
      expires_in: tokenInfo.expiresIn 
    });
  } catch (error) {
    console.error('Error generating Box token:', error);
    res.status(500).json({ error: error.message });
  }
};