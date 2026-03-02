📄 PRD.md
Private 2-User Secret Chat App With Bollywood News Cover Mode (MERN, Mobile-First)
1. Project Summary

This is a private, hidden 2-user chat app that is completely disguised as a Bollywood News Website.

The chat app is NOT visible unless the user enters through a secret access point and enters a Room Name + Raw Room Password.

Messages auto-delete after 24 hours, so when users return the next day:

All messages younger than 24 hours remain visible

Messages older than 24 hours are automatically deleted

The app has extremely strong privacy:

First-time visitors ALWAYS see a Bollywood news homepage

When app loses focus (background/home/switch app), chat session is instantly hidden

App shows Bollywood homepage again

Only secret link reveals chat UI

Only 2 users can ever be in one room

2. Objectives

Completely hide chat functionality behind a fake Bollywood website

Allow private real-time chat for only 2 users

Messages must auto-delete after 24 hours

Rooms never expire unless manually deleted

Mobile-first UI

High privacy when switching apps or minimizing

Safe even if someone else opens the app accidentally

Returning users can rejoin and see any messages still within the 24h window

3. Core Features
✔ Fake Bollywood News Homepage (ALWAYS SHOWS FIRST)

Default visible screen for any user

Articles, thumbnails, gossip, trending news

Looks like a normal entertainment website

✔ Hidden Secret Entry Link

Only known to you and your friend

Opens a password popup

Leads to the real chat system

✔ Room-Based Chat

Create Room (Room Name + Raw Password + Nickname)

Join Room (Room Name + Raw Password + Nickname)

Stored raw password

Room stays forever until manually deleted

✔ Real-time Messaging (Socket.IO)
✔ REQUIRED: Typing Indicator
✔ Messages Auto-Delete After 24 Hours

Messages younger than 24h must remain visible

Messages older than 24h are auto-purged by MongoDB TTL

✔ Auto Session Lock on App Background or Focus Loss

Clears session

Disconnects socket

Redirects to Bollywood homepage

✔ Rejoin Chat Anytime

User goes through secret entry

Enters room again

Sees messages that still exist (<24h old)

✔ Only 2 Users Per Room
4. User Flows
4.1 First Visit Flow

User opens app

Bollywood Homepage displayed

Hidden entry link

Access password popup

If valid → Show Create Room / Join Room page

4.2 Create Room Flow

Enter Room Name

Enter Raw Password

Enter Nickname

Room created

User joins chat immediately

4.3 Join Room Flow

Taps secret entry

Enters access password

Enters Room Name + Raw Password + Nickname

Joins chat if:

Room exists

Raw password matches

Active users < 2

4.4 Chat Flow

Users exchange real-time messages

Typing indicator active

Messages stored with timestamps

Messages remain visible until they hit 24 hours

Messages older than 24 hours are deleted

Returning Next Day:

User enters via secret link → Join Room

Backend returns messages younger than 24 hours

Chat continues normally

4.5 Focus Loss → Fake Page

Triggered by:

Switching apps

Pressing home

Screen lock

Browser background

Page reload

Actions:

Clear session

Disconnect socket

Redirect to Bollywood homepage

Re-entry:

Tap secret link

Password

Re-join room

Continue chat

5. Functional Requirements
5.1 Bollywood Homepage

Looks like a professional Bollywood entertainment site

Static content (JSON or hardcoded)

Shows:

Cards

Images

Trending stories

Celebrity gossip

NO sign of chat system

Includes:

Hidden clickable area that opens secret popup

5.2 Secret Entry Mechanism

Hidden or disguised UI element

Opens password popup

If correct → Show room pages

If wrong → Reload Bollywood homepage

5.3 Room Requirements

Room Name must be unique

Raw password stored without hashing

Room never auto-deletes

Room can be manually removed in MongoDB

Only 2 active users allowed

5.4 Chat Requirements

Real-time messaging

Typing indicator REQUIRED

Auto-scroll

Messages stored in DB

Messages auto-delete after 24h via TTL

5.5 Session Lock

Detect background mode immediately

Clear sessionStorage

Disconnect socket

Redirect to Bollywood homepage

6. REST API Endpoints
POST /api/rooms

Create room

POST /api/rooms/join

Join room

GET /api/rooms/:roomId/messages?limit=N

Fetch last N messages
(Only messages younger than 24 hours will exist)

7. Socket.IO Events
Client → Server
Event	Payload	Description
join_room	{ roomId, displayName }	Join room
new_message	{ roomId, text }	Send message
typing	{ roomId }	User typing
stop_typing	{ roomId }	User stopped typing
Server → Client
Event	Description
message	New message object
typing	Friend is typing
stop_typing	Friend stopped typing
user_joined	User entered room
user_left	User disconnected
room_full	Room already has 2 users
8. Database Schema (Collections / “Tables”)
8.1 rooms Collection
Field	Type	Description
_id	ObjectId	Room ID
name	String	Unique room name
rawPassword	String	Raw password
createdAt	Date	Created timestamp
maxUsers	Number	Always 2
8.2 messages Collection
Field	Type	Description
_id	ObjectId	Message ID
roomId	ObjectId	ID of associated room
senderName	String	Nickname
text	String	Message text
createdAt	Date	Timestamp
🔄 TTL Auto Deletion

All messages auto-delete after 24 hours:

db.messages.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 }
);

Thus:

If user returns next day:

Messages <24h old → visible

Messages >24h old → deleted

8.3 activeUsers (In-memory Only)

Not stored in MongoDB.

Used for controlling room max capacity.

Example:

{
  "room123": {
    "count": 2,
    "users": ["Alice", "Bob"]
  }
}
9. Mobile UI Requirements

Entire design must be mobile-first

Chat UI similar to WhatsApp-lite

Bollywood homepage must look real

Buttons easy to tap

Typing input fixed at bottom

Smooth scrolling

10. Non-Functional Requirements
Area	Requirement
Performance	100ms message latency
Security	HTTPS, raw password allowed
Privacy	Fake homepage always shows first & on focus loss
Usability	Easy mobile experience
Reliability	System works consistently
Scalability	Only 2 users — low load
11. Success Criteria

✔ App always opens to Bollywood homepage
✔ Chat is 100% hidden from outsiders
✔ Secret link works properly
✔ Users can create/join room anytime
✔ Returning users see messages NOT older than 24 hours
✔ Typing indicator works instantly
✔ Real-time chat is reliable
✔ Auto-session lock works when switching apps
✔ Messages clean automatically after 24 hours
