# Chrome Web Store submission

Everything the developer dashboard asks for, ready to paste.

## Package

`dist/blur-for-whatsapp-web-1.0.0.zip` — upload this. It contains only the
extension itself (manifest, scripts, styles, icons), not the README, store
assets or git files.

## Store listing

**Name**
```
Blur for WhatsApp Web
```

**Summary** (132 char limit — this is 91)
```
Blur contact names and messages on WhatsApp Web. Hover a chat to reveal only what you need.
```

**Category:** Privacy & Security
**Language:** English

**Detailed description**
```
Working in a cafe, sharing your screen on a call, or sitting in an open
office? Your WhatsApp Web chat list broadcasts who is messaging you and what
they said, to anyone who glances over.

Blur for WhatsApp Web blurs it. Contact names, message previews, timestamps
and the messages inside an open conversation are all blurred until you hover
the one you actually want to read — the name and the message clear together,
then blur again the moment you move away.

WHAT YOU CAN BLUR
• Chat list — names, previews, timestamps, unread badges
• Open conversation — every message bubble and the header name
• Profile photos — optional, off by default

CONTROLS
• Blur strength, from a light haze to completely unreadable
• Reveal on hover, or require a click — safer while screen sharing
• Alt+Shift+B toggles all blurring instantly
• Settings save automatically and apply without reloading

PRIVACY
No accounts, no servers, no analytics, no network requests of any kind.
Nothing is collected and nothing leaves your machine. The extension only runs
on web.whatsapp.com and does nothing anywhere else. The source is public and
MIT licensed: https://github.com/rasangalk/whatsapp-blur-extension

Note: blurring is visual. It hides your messages from people looking at your
screen — it is not encryption and not a substitute for locking your computer.

Not affiliated with, endorsed by, or connected to WhatsApp or Meta.
```

## Privacy practices tab

**Single purpose**
```
Visually blur contact names and message content on WhatsApp Web so they cannot
be read by people looking at the user's screen, revealing them on hover or
click.
```

**Justification — `storage`**
```
Stores the user's own settings: blur on/off, blur strength, hover-or-click
reveal mode, and which areas to blur. No user content is stored.
```

**Justification — host permission for `https://web.whatsapp.com/*`**
```
The extension applies its blur to WhatsApp Web's interface, so it must run a
content script on that site. It requests no other host and runs nowhere else.
```

**Remote code:** No — all code is in the package.

**Data collection:** Nothing collected. Tick no categories, and confirm the
three certifications (no unrelated selling, no unapproved use, no
creditworthiness use).

**Privacy policy URL**
```
https://github.com/rasangalk/whatsapp-blur-extension/blob/main/PRIVACY.md
```
(The repo must be public and pushed before submitting, or this link 404s.)

## Graphics

| Asset | File | Size |
| --- | --- | --- |
| Screenshot 1 | `store/screenshot-1-chat-list.png` | 1280×800 |
| Screenshot 2 | `store/screenshot-2-settings.png` | 1280×800 |
| Small promo tile | `store/promo-tile-440x280.png` | 440×280 |
| Store icon | `icons/icon128.png` | 128×128 |

Marquee promo tile (1400×560) is optional and only used if the extension is
featured.

## Before you submit

1. Push the repo — the privacy policy URL and the source link must resolve.
2. Enable 2-Step Verification on the Google account, pay the one-time $5
   developer registration fee.
3. Upload the zip, paste the fields above, attach the graphics.
4. Review usually takes a few days; host permissions can make it longer.
