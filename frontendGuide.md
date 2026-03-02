📄 FRONTEND_GUIDE.md
Frontend Architecture & UI Guide (MERN, Mobile-First, Secret Chat, Bollywood Cover, Zustand)
1. Frontend Tech Stack
Framework

React + Vite (fastest + perfect for Vercel Free)

State Management

Zustand (global and super fast — minimal re-renders)

Real-Time

Socket.IO client

Styling

TailwindCSS (recommended)

Custom utility CSS (optional)

Routing

React Router

Deployment Target

Vercel Free Plan
→ needs small bundle, no heavy libraries, optimized components

2. Performance Goals (Vercel Free Plan)

First-page load < 2 seconds even on weak mobile 4G

Bundle < 300 KB ideally

Lazy-load heavy components

Zero heavy UI libraries (NO MUI, NO Antd, NO Chakra)

Images: small JPG/WEBP

Zustand selectors for minimal component re-renders

3. Frontend Folder Structure
frontend/
  ├── public/
  ├── src/
  │   ├── components/
  │   │   ├── chat/
  │   │   │   ├── ChatMessage.jsx
  │   │   │   ├── TypingIndicator.jsx
  │   │   │   └── MessageInput.jsx
  │   │   ├── layout/
  │   │   │   └── Header.jsx
  │   │   └── bollywood/
  │   │       ├── BollywoodCard.jsx
  │   │       └── FakeFooter.jsx
  │   ├── pages/
  │   │   ├── BollywoodHome.jsx
  │   │   ├── SecretAccess.jsx
  │   │   ├── CreateRoom.jsx
  │   │   ├── JoinRoom.jsx
  │   │   └── ChatRoom.jsx
  │   ├── store/
  │   │   └── useAppStore.js
  │   ├── hooks/
  │   │   └── useSessionLock.js
  │   ├── utils/
  │   │   ├── socket.js
  │   │   └── api.js
  │   ├── App.jsx
  │   └── main.jsx
  └── package.json
4. Routing Map
Route	Page	Explanation
/	BollywoodHome	Fake Bollywood News Website
/secret	SecretAccess	Hidden entry popup
/create	CreateRoom	Create a room
/join	JoinRoom	Join a room
/chat/:roomId	ChatRoom	Real-time chat
5. State Management (Zustand)

Global state stored in:

src/store/useAppStore.js
Store Handles:
Slice	Purpose
user	nickname
room	roomId, roomName
messages	real-time chat list
typing	whether friend is typing
socket	Socket.IO reference
sessionLock	lock when app goes background

Zustand ensures:

Fast

No complex reducers

Minimal re-render on mobile

6. Pages (Full Design According to PRD.md)
6.1 BollywoodHome.jsx
(Default Page — Must Look Like Real Bollywood News Site)
Requirements:

Top news banners

Trending celebrity cards

Fake movie gossip

Footer links

100% disguise — no chat-related words

Hidden Entry Options:

Triple-tap logo

Tiny invisible dot (opacity 0.01) in corner

Hidden gesture, invisible for others

Behavior:

User taps secret area → navigate to /secret

6.2 SecretAccess.jsx
UI:

Modal style screen

Input → Access Password

Buttons: Continue / Cancel

Behavior:

On valid password → navigate to Create/Join options

On invalid → return to BollywoodHome

This is the first layer of security.

6.3 CreateRoom.jsx
Fields:

Room Name

Raw Password

Nickname

Behavior:

POST /api/rooms

Store roomId, roomName, displayName in Zustand

Navigate → /chat/:roomId

UX:

Clean, simple form

Mobile-optimized

Large buttons

6.4 JoinRoom.jsx

Almost identical to CreateRoom.jsx.

Fields:

Room Name

Raw Password

Nickname

Behavior:

POST /api/rooms/join

If valid → join chat

If wrong password → show error

If room full → show error

6.5 ChatRoom.jsx
(Main Chat Interface — MUST BE MODERN, BEAUTIFUL, EASY)

This is the MOST IMPORTANT page.

Layout:

Header

Scrollable message list

Typing indicator

Message input bar

Chat Header

Back arrow → returns to BollywoodHome

Room name

“Friend is typing…” (if typing event received)

Message Bubbles
Self (Right side)

Light green (#DCF8C6)

Rounded bubble

Small timestamp inside

Friend (Left side)

White bubble with light border

Left aligned

Rounded bubble

Typing Indicator

Displays:

Friend is typing...

Smooth fade animation

Message Input Area

Textarea

Send button

Auto grows with text

Emits:

typing

stop_typing

new_message

7. Socket Flow
On mount:

Create socket

Emit join_room

Fetch /api/rooms/:roomId/messages
→ Messages <24 hours appear (as PRD requires)

Listeners:

message → addMessage

typing → show typing

stop_typing → hide typing

user_joined

user_left

On unmount:

Disconnect socket

Clear room in Zustand

8. Session Lock (Critical for PRD Privacy)

File: useSessionLock.js

Trigger events:

visibilitychange

blur

pagehide

switching apps

pressing home

tab background

Behavior:

Clear Zustand state

Clear sessionStorage

Disconnect socket

Navigate to / (fake Bollywood site)

Result:

Nobody ever sees chat accidentally.

9. API Helper

utils/api.js

Small lightweight wrapper using fetch:

export const API = import.meta.env.VITE_API_URL;

Used for:

Create room

Join room

Fetch messages

10. Styling Guide (Modern WhatsApp-like, Lightweight)
Colors:
Element	Color
Self bubble	#DCF8C6
Friend bubble	#FFFFFF
Header	#075E54
Background	#ECE5DD
Border Radius:

Bubbles: rounded-2xl

Inputs/buttons: rounded-full

Shadows:

Very light shadows, mobile-friendly

No heavy blur (affects performance on old phones)

11. Mobile UX Rules (Required)

Single-column layout only

No desktop-specific UI

Sticky message input

Large tappable icons

No overflow scroll issues

Use overflow-y-scroll + scroll-smooth

12. Vercel Free Optimization (Must Follow)

Because this is a private 2-user app and you deploy to Vercel free:

Must do:

Keep bundle small

Remove unused libraries

Compress images

Use Vite (already fastest)

Use Zustand selectors to prevent re-render

SSR not needed; use SPA mode

Avoid:

MUI, Ant Design, Chakra

Lottie animations

Big images

Heavy fonts

13. Error Handling UX
Create/Join Room:

Wrong password → small red error

Room already exists → show small toast

Room full → show error

Chat:

If disconnected → show small badge “Reconnecting...” (optional)

14. Key Frontend Logic Summary
Feature	How frontend handles
Fake page	Default route /
Secret entry	Hidden navigation to /secret
Session lock	useSessionLock()
2 users only	Backend rejects, FE shows message
Messages <24h remain	FE re-fetches from backend
Typing	via socket events
Privacy	Always redirect to BollywoodHome on blur
15. Completed Frontend Guide

This FRONTEND_GUIDE.md covers:

Page structure

State management (Zustand)

UI/UX

Socket flow

Vercel performance

Modern chat design

Bollywood disguise behavior

Session lock system

It fully matches PRD.md.