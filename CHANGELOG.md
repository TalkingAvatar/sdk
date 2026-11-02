# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-11-02

Realistic Avatars move to their own package. Until now they shipped inside the open-source
`@interviewflowai/talking-avatar` (0.1.3 to 0.2.0), which is now only the free 3D lip sync.

To upgrade, install `@talkingavatar/sdk` and change the imports; the API is unchanged:

- `@interviewflowai/talking-avatar/server` → `@talkingavatar/sdk/server`
- `@interviewflowai/talking-avatar/live` → `@talkingavatar/sdk/live`

### Added

- `metadata` on `createAgentLink`: your own data for the link (such as who it's for), sent with the tool calls and
  the post-call webhook of its calls as `call.link.metadata`, and returned on each link.

### Changed

- `pushAudio`'s `playAtMs` (LiveKit, playing the voice yourself): send the audio ~200 ms before it's heard (was ~400 ms).
