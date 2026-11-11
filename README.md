<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://talking-avatar.dev/brand/talking-avatar-logo-dark.png" />
  <img src="https://talking-avatar.dev/brand/talking-avatar-logo-light.png" alt="Talking Avatar" width="280" />
</picture>

# Realistic Avatars SDK

[![npm](https://img.shields.io/npm/v/@talkingavatar/sdk)](https://www.npmjs.com/package/@talkingavatar/sdk)
[![types](https://img.shields.io/npm/types/@talkingavatar/sdk)](src/server.ts)

**Photorealistic talking avatars for voice agents.** Send your agent's voice as it's generated; your users see a
real-looking person say it, with accurate lip sync, natural expressions and subtle head motion, streamed to your page
in real time. For AI interviewers, tutors, support and sales assistants.

**[Website](https://talking-avatar.dev) · [Docs](https://docs.talking-avatar.dev/realistic-avatars/overview) ·
[Live demo](https://talking-avatar.dev/demo) · [Create an account](https://app.talking-avatar.dev)**

- **Any voice:** OpenAI, ElevenLabs, Azure, Fish Audio, Cartesia, or any other TTS or speech-to-speech model. The
  avatar follows the audio, so no text or timings are needed.
- **Real time:** speech appears on the avatar's lips moments after you send it, ready for live conversation.
  Interruptions (barge-in) are handled in one call.
- **Voice and video in sync,** delivered together over WebRTC. No media servers to run.
- **Drop-in for LiveKit:** the avatar can join your LiveKit room as a participant instead (on LiveKit Agents in Python, use our plugin, `livekit-plugins-talkingavatar`).
- **A few lines of code** on your server and your page. The SDK handles streaming, playback and reconnection.

> **Looking for something free?** [`@interviewflowai/talking-avatar`](https://github.com/interviewflowai/talking-avatar)
> is the open-source (MIT) 3D lip sync: built-in male and female 3D avatars, or your own `.glb`, animated from any
> audio entirely in the browser. No account, no API key.

## Contents

- [See them talk](#see-them-talk)
- [Pricing](#pricing)
- [Get started](#get-started)
- [Your server](#your-server)
- [Your page](#your-page)
- [LiveKit](#livekit)
- [Avatars](#avatars)
- [Sessions and errors](#sessions-and-errors)
- [Voice agent links](#voice-agent-links)
- [API reference](#api-reference)
- [Development](#development)

## See them talk

Two avatars, each speaking an OpenAI TTS voice. Click to watch, with sound.

| Friendly host | Friendly coach |
|---|---|
| [![Friendly host: watch the demo](https://recordings.talking-avatar.dev/talking-avatar-ava6-poster.jpg)](https://recordings.talking-avatar.dev/talking-avatar-ava6-demo.mp4) | [![Friendly coach: watch the demo](https://recordings.talking-avatar.dev/talking-avatar-ava7-poster.jpg)](https://recordings.talking-avatar.dev/talking-avatar-ava7-demo.mp4) |
| [▶ Watch the demo (15 s)](https://recordings.talking-avatar.dev/talking-avatar-ava6-demo.mp4) | [▶ Watch the demo (15 s)](https://recordings.talking-avatar.dev/talking-avatar-ava7-demo.mp4) |

## Pricing

**$0.02 per minute** of avatar session, billed by the second. No subscription, no minimum, no setup fee.

1. [Create an account](https://app.talking-avatar.dev).
2. Add credits, and turn on auto top-up if you'd like your balance refilled automatically.
3. Create an API key and start building.

$10 of credits is 500 minutes of conversation. Usage and spend are shown live in the dashboard.

## Get started

```sh
npm install @talkingavatar/sdk
```

The SDK has two parts, because your API key must stay on your server:

| Import | Runs on | Does |
|---|---|---|
| `@talkingavatar/sdk/server` → `LiveAvatar` | your server (Node.js 22+) | starts the avatar, sends your agent's voice, handles interruptions |
| `@talkingavatar/sdk/server` → `createAgentLink` | your server (Node.js 18+) | makes links to your private voice agents |
| `@talkingavatar/sdk/live` → `LiveAvatarView` | your page | shows the avatar with its voice, reconnects by itself |

### Your server

```js
import { LiveAvatar } from "@talkingavatar/sdk/server";

const avatar = await LiveAvatar.start({
  apiKey: process.env.TALKING_AVATAR_API_KEY, // tav_…
  avatar: "your-avatar-id",                    // from the dashboard's Quickstart
  sampleRate: 24000,                           // your TTS audio's sample rate
});

// One route for your page. It sets up the video connection; any number of viewers.
app.post("/avatar", async (req, res) => {
  try {
    res.json(await avatar.handleView(req.body));
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

// Your agent's voice as it streams: PCM16 mono, as an Int16Array, a Buffer or base64.
tts.on("audio", (pcm) => avatar.pushAudio(pcm));

// The user interrupted: stop speaking. Resolves with how much of the reply they heard.
const heardMs = await avatar.clear();

avatar.on("speechStarted", () => {});
avatar.on("speechEnded", (playedMs) => {});
avatar.close(); // end of the conversation: billing stops
```

The avatar plays the voice itself, in sync with its lips, so don't play your TTS audio anywhere else. Audio can
arrive faster than real time; it's queued and spoken at its natural pace.

### Your page

```js
import { LiveAvatarView } from "@talkingavatar/sdk/live";

const view = new LiveAvatarView({
  container: document.getElementById("avatar"), // the video fills this element
  endpoint: "/avatar",                          // the route above
});

document.getElementById("start").onclick = () => view.connect(); // after a click, so the voice can play
```

Running several conversations at once? Keep one `LiveAvatar` per conversation and give each its own route, such as
`/avatar/:conversationId`.

### LiveKit

Already using LiveKit? The avatar can join your room instead, with its video and voice as tracks. Mint a
publish-only token for it; your LiveKit secrets stay with you.

```js
const avatar = await LiveAvatar.start({
  apiKey: process.env.TALKING_AVATAR_API_KEY,
  avatar: "your-avatar-id", // from the dashboard's Quickstart
  livekit: { url: LIVEKIT_URL, token: avatarToken }, // video track "avatar", voice track "avatar-audio"
});
tts.on("audio", (pcm) => avatar.pushAudio(pcm));
```

Your LiveKit client plays the tracks, so `LiveAvatarView` isn't needed.

Agent on LiveKit Agents in Python? Use our plugin instead of this package:
`pip install livekit-plugins-talkingavatar` ([PyPI](https://pypi.org/project/livekit-plugins-talkingavatar/),
[guide](https://docs.talking-avatar.dev/realistic-avatars/livekit#livekit-agents-python)).

## Avatars

Professional and casual avatars are ready to use. The current list, with previews and each avatar's ID, is in the
[dashboard's Quickstart](https://app.talking-avatar.dev/quickstart).

All avatars stream at 832×468 (16:9), 25 frames per second. `LiveAvatarView` fits the video inside its container
without cropping.

**Custom avatars:** your own face or your brand's presenter, $199 per avatar (one time). Request one from the
[dashboard](https://app.talking-avatar.dev/custom-avatar); we reply with a payment link, then you send a short video and
voice recording with the signed consent of the person on camera. Sessions cost the usual $0.02 a minute.

## Sessions and errors

A session is billed from the moment the avatar is live until you call `close()` (or your server disconnects).
Running sessions are checked every 30 seconds, and end when your account runs out of credits or reaches the monthly
spending limit you set on the dashboard's Billing page.
`LiveAvatar.start` rejects with a `LiveAvatarError` when a session can't start, and the `close` event reports why a
session ended:

| Code | Meaning |
|---|---|
| `1000` | You closed the session |
| `4001` | Invalid or missing API key |
| `4002` | Out of credits (below a minute's worth at the start, or used up during the session), or your monthly spending limit is reached: add credits, turn on auto top-up, or raise the limit |
| `4003` | The session reached its 3-hour limit |

## Voice agent links

A voice agent made in the dashboard can be private: then only people with one of its links can call it. Make the
links on your server, one per user, each with an expiry and, if you like, a number of calls (1 for a one-time link):

```js
import { createAgentLink } from "@talkingavatar/sdk/server";

const link = await createAgentLink({
  apiKey: process.env.TALKING_AVATAR_API_KEY,
  agentId: "your-agent-id",                         // dashboard → Voice agents
  name: "Interview with Jane",                      // optional, shown in the dashboard
  expiresAt: new Date(Date.now() + 7 * 86400_000),  // default: in 24 hours
  maxUses: 1,                                       // default: any number of calls
  metadata: { candidateId: "c-42" },                // optional, sent with the calls' tool calls and webhook
});
// link.url: send it, or put it in your page
```

```html
<iframe src="LINK_URL&embed=1" allow="microphone; autoplay" style="width:100%;height:640px;border:0"></iframe>
```

`listAgentLinks({ apiKey, agentId })` lists them (with `uses`), and `deleteAgentLink({ apiKey, agentId, linkId })`
stops one right away. They throw a `TalkingAvatarApiError` (with the HTTP `status`) when the request fails. Calls are
billed to your balance like the agent's other calls.

## API reference

### `LiveAvatar.start(options)` (from `@talkingavatar/sdk/server`)

Resolves with a `LiveAvatar` once the avatar is live.

| Option | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | required | Your `tav_…` key. Keep it on your server. |
| `avatar` | `string` | required | An avatar ID, from the dashboard's Quickstart. |
| `sampleRate` | `8000 \| 12000 \| 16000 \| 24000 \| 48000` | `24000` | Your TTS audio's sample rate (PCM16 mono). |
| `livekit` | `{ url, token, publishAudio?, audioTrackName? }` | | Join your LiveKit room instead of streaming to `LiveAvatarView`. With `publishAudio: false` you play the voice yourself and pass `playAtMs` to `pushAudio`. |
| `WebSocket` | class | global `WebSocket` | For Node.js 18 and 20: `import WebSocket from "ws"`. |

| Member | Description |
|---|---|
| `pushAudio(pcm, { sampleRate?, playAtMs? })` | Queue your agent's voice: `Int16Array`, bytes (`Buffer`, `Uint8Array`, `ArrayBuffer`) or base64, in chunks of any size. |
| `clear()` | Interrupt. Resolves with how many ms of the interrupted reply were heard. |
| `handleView(body)` | Your page's route: pass the request body, return the result as JSON. |
| `on(event, listener)` | `speechStarted`, `speechEnded(playedMs)`, `republished` (recovered from a network drop; the page reconnects by itself), `close(code, reason)`. Returns an unsubscribe function. |
| `close()` | End the session. Billing stops. |
| `width`, `height` | The video size. |

### `new LiveAvatarView(options)` (from `@talkingavatar/sdk/live`)

| Option | Type | Default | Description |
|---|---|---|---|
| `container` | `HTMLElement` | required | Element the video fills, or your own `<video>`. |
| `endpoint` | `string \| (body) => Promise<object>` | required | Your route, or a function that calls it (for example, with auth headers). |
| `iceServers` | `RTCIceServer[]` | public STUN | Add your TURN server for users behind strict firewalls. |
| `onStatus` | `(status) => void` | | `connecting`, `live`, `muted` (the browser blocked sound: call `unmute()` from a click), `reconnecting`, `closed`. |
| `onError` | `(error) => void` | `console.warn` | Connection errors. It retries by itself. |

Methods: `connect()`, `disconnect()`, `unmute()`. Properties: `video` (the `<video>` element), `status`.

### Agent links (from `@talkingavatar/sdk/server`)

| Function | Description |
|---|---|
| `createAgentLink({ apiKey, agentId, name?, expiresAt?, maxUses?, metadata? })` | A new link. Resolves with `{ id, name, url, token, expiresAt, maxUses, uses, metadata, createdAt }`. |
| `listAgentLinks({ apiKey, agentId })` | The agent's links. |
| `deleteAgentLink({ apiKey, agentId, linkId })` | Stops a link right away. |

# Development

```sh
npm install
npm test           # LiveAvatar against a fake API, agent links
npm run typecheck
npm run build      # dist/: ESM bundles and type declarations
```

```
src/
  server.ts       LiveAvatar: sessions, audio, interruptions, the page's route (Node.js)
  agentLinks.ts   createAgentLink, listAgentLinks, deleteAgentLink (Node.js)
  live.ts         LiveAvatarView: WebRTC playback in the page
test/             node:test suites
```

Changes are listed in [CHANGELOG.md](CHANGELOG.md); report security issues as described in [SECURITY.md](SECURITY.md).

# License

The SDK is [MIT](LICENSE) licensed. Realistic Avatars are a paid service, billed at $0.02 per minute of session to
your account. Built and maintained by [Talking Avatar](https://talking-avatar.dev).
