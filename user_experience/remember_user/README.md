# Remember The User
When using FB Messenger embeds, the user is automatically presented with a chat window that knows their name and shows their conversation history. This is possible because Facebook is happily tracking the user across the interwebs to your site and, assuming they are logged into Facebook, automatically logs them into Messenger. 

Being a little less creepy, we do not automatically know who's on our site. However, we can greatly improve user experience by greeting returning users by their name (rather than the tedious "default-user" or "Anonymous"). We should, and can, also present them with their conversation history.

# Backend Code to Maintain Sessions
The only requirement to maintain sessions is to prevent tokens from expiring - by refreshing them with the Direct Line API. We will shortly add this to our Secure Token Generator section. In the meantime, you can achieve a lot of the functionality using purely frontend code.

# Frontend Code to Remember Sessions and User Name
We use [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to keep track of tokens, expiry and user data like userId and name. When the user returns within the token expiry time period, we reuse the token and Direct Line automatically sends conversation history and user name to the web chat! 

If the user returns after the token has expired, we use the locally stored userId and user name to start a new session with fresh tokens. Because we are aware of the user's credentials, the web chat shows the user's credentials and does not prompt them to log in again. However, since this is a fresh token, the web chat does not show conversation history.