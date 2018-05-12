# Theme Integration

Now that you have your webchat working, you will want to integrate it thematically with the rest of your site. In this section we discuss a few touches that will make your web chat fit in seamlessly.

## Colours

We are loading the webchat in the div called "#BotChatGoesHere". You can style this div per your requirements and the web chat will inherit the style. See "styles.css" for an example that fits in with our domain - http://dara.network.

## Position & Size

You will want to ensure that the chat button and window appear appropriately in both desktop and mobile views. For instance, we wanted that

- the webchat button should be on the left with the FB button on the right (floatingBtn->left:20)
- the chat window should be full screen on a mobile view but 400px (width) by 550px (height) on a desktop (via media queries)
- the chat window should include a close button in the header bar
- the webchat window should show right above the chat button (BotChatGoesHere->bottom:70)
- buttons inside the web chat window should not get clipped on narrow mobile devices (by overring webchat's internal CSS class 'wc-adaptive-card')

## Loading Indicator
Because the token can sometimes take upwards of 15 seconds to load, you will want to give your user a visual indicator that something is loading. We use a spinner gif like the one shown below. This is especially helpful for mobile users because on a desktop you can change cursor to indicate loading but you cannot do this on a mobile browser.

![Spinner Loading Indicator](bg-spinner.gif)

