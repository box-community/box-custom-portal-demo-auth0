const BoxSDK = require('box-node-sdk');
require('dotenv').config();
const fs = require('fs');

async function init() {
  try {
    const sdk = new BoxSDK({
      clientID: process.env.BOX_CLIENT_ID,
      clientSecret: process.env.BOX_CLIENT_SECRET,
      appAuth: {
        keyID: process.env.BOX_PUBLIC_KEY_ID,
        privateKey: process.env.BOX_PRIVATE_KEY.replace(/\\n/g, '\n'),
        passphrase: process.env.BOX_PASSPHRASE, 
      },
    });

    const serviceClient = sdk.getAppAuthClient('enterprise', process.env.BOX_ENTERPRISE_ID);
    var portalFolder = await serviceClient.folders.create('0', 'Portal Demo');
    console.log("Parent Portal Folder ID: ", portalFolder.id);
    var stream = fs.createReadStream('init/sample_statement.pdf');
    var statementFile = await serviceClient.files.uploadFile(portalFolder.id, 'dummy_statement_file.pdf', stream);
    console.log("Dummy Statement File ID: ", statementFile.entries[0].id);
    stream = fs.createReadStream('init/sample-terms-conditions-agreement.pdf');
    var tandcFile = await serviceClient.files.uploadFile(portalFolder.id, 'terms_and_conditions_file.pdf', stream);
    console.log("Dummy Terms and Conditions File ID: ", tandcFile.entries[0].id);
    stream = fs.createReadStream('init/logo.png');
    var logoFile = await serviceClient.files.uploadFile(portalFolder.id, 'logo.png', stream);
    console.log("Dummy Logo File ID: ", logoFile.entries[0].id);
    var logoLink = await serviceClient.files.update(logoFile.entries[0].id, {shared_link: {access: 'open'}});
    console.log("Logo Link :", logoLink.shared_link.download_url);
  } catch (error) {
    console.error('Critical error in Init operations:', error);
  }
}

init();
