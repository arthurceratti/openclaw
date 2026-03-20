
## Calendar Access Issue - To Implement Later

### Problem
- OAuth client `841811454014-r3isq7q8q3e81o640o0g9h359l9t77av.apps.googleusercontent.com` 
  does not have `offline_access` permission for obtaining refresh tokens
- Refresh token `1//04hDrzfVSjiLyCgYIARAAGAQSNwF-L9IrIYr8AxYtLeqMXd6nIElEMsGtkLPhkG0_dvSCtZLZ8TYdGObF89TVVB8STc9aVLtg-3A` 
  returns `unauthorized_client` error when used
- Gmail access works (uses direct access token from Playground)
- Calendar access fails with "No auth for calendar"

### Solutions to Implement Later
1. **OAuth Playground with Calendar Scopes**
   - Use OAuth Playground to obtain new access token with `https://www.googleapis.com/auth/calendar` scope
   - Token expires in ~1 hour but can be refreshed manually
   - Steps:
     - Go to https://developers.google.com/oauthplayground/
     - Configure with OAuth client credentials
     - Select scopes: `https://www.googleapis.com/auth/calendar`, `https://www.googleapis.com/auth/calendar.readonly`
     - Exchange auth code for tokens
     - Copy JSON token and save to `/data/.config/gogcli/credentials.json`

2. **Service Account with Domain-Wide Delegation**
   - Create service account in Google Cloud Console
   - Enable domain-wide delegation for `arthurceratti@gmail.com`
   - Download service account JSON key
   - Use with: `gog auth service-account set arthurceratti@gmail.com --key <path/to/key.json>`

3. **Create New OAuth Client with Offline Access**
   - In Google Cloud Console, create new OAuth client
   - Enable "Allow offline access" during creation
   - This allows obtaining refresh tokens for long-lived access

### Status
- ✅ Gmail: Working with direct access token
- ❌ Calendar: Needs new token or service account
- 📝 Saved for later implementation

---
Last updated: 2026-03-14 16:25 GMT-3
