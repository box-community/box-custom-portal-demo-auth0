exports.onExecutePostLogin = async (event, api) => {
    // If email isn't verified, handle redirection
    if (!event.user.email_verified) {
        // Get the application URL from the login request
        const appUrl = event.request.query?.redirect_uri 
            ? new URL(event.request.query.redirect_uri).origin 
            : 'http://localhost:3000';
            
        console.log('Auth0 Verification Check:', {
            logins_count: event.stats.logins_count,
            email_verified: event.user.email_verified,
            hostname: event.request.hostname,
            appUrl: appUrl,
            redirect_uri: event.request.query?.redirect_uri
        });

        // Prevent login and redirect to verification page
        api.redirect.sendUserTo(`${appUrl}/verify-email`);
    }
};