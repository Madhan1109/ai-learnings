# Real-time Communication Protocols

## WebSocket (STOMP) for Chat and Announcements
- Endpoint: `/ws` (SockJS supported)
- Topics:
  - `/topic/public` — Real-time chat messages
  - `/topic/announcements` — Instructor announcements
- Send messages to:
  - `/app/chat.sendMessage` (chat)
  - `/app/chat.announce` (announcement)
- Protocol: STOMP over WebSocket
- Authentication: JWT (if enabled)

## Redis Pub/Sub
- Used for scaling chat and notification messages across multiple instances.
- Channel: `chat` (for chat messages), `announcements` (for announcements)
- Messages are published to Redis and broadcast to all WebSocket subscribers.

## RabbitMQ Async Events
- Used for asynchronous updates (e.g., enrollment events, quiz completions).
- Exchanges:
  - `enrollment.exchange` (enrollment events)
  - `quiz.exchange` (quiz/assessment events)
- Routing keys: `enrollment.created`, `enrollment.completed`, etc.
- Services publish/subscribe to these events for decoupled communication.

## Sequence Example: Real-time Chat
1. Client connects to `/ws` via WebSocket (STOMP/SockJS)
2. Client subscribes to `/topic/public`
3. Client sends message to `/app/chat.sendMessage`
4. Server receives, publishes to Redis, and broadcasts to all subscribers

## Sequence Example: Enrollment Event
1. Enrollment Service creates an enrollment
2. Publishes event to RabbitMQ (`enrollment.exchange`)
3. Other services (e.g., Notification) consume the event for further processing 