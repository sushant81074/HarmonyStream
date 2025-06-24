# HarmonyStream

HarmonyStream: A Spotify-like Music Streaming Platform
Project Goal: To build a core, functional, and scalable backend for a music streaming service, demonstrating a microservices architecture using Node.js, gRPC, Express, MongoDB, and Redis.

I. Architectural Overview
HarmonyStream will adopt a microservices architecture to decouple functionalities, allowing for independent development, deployment, and scaling.

Client Applications: (Outside our scope, but interact with) Web App, Mobile Apps.

API Gateway: The single entry point for all external client requests. It handles routing, authentication, and request aggregation.

Microservices: Independent services, each responsible for a specific domain. They communicate internally primarily via gRPC.

Databases: MongoDB for persistent data storage.

Caching/Messaging: Redis for high-speed data access, caching, and real-time messaging (Pub/Sub).

Containerization: Docker and Docker Compose for development and orchestration.

+----------------+
| Client Apps |
| (Web/Mobile) |
+-------+--------+
| HTTP/REST
|
+-------v--------+
| API Gateway | (Node.js/Express.js, JWT Auth, Rate Limiting)
+-------+--------+
| gRPC / HTTP (Internal Calls)
|
+-------+------------------+------------------+------------------+------------------+------------------+
| | | | | | |
| +-----v------+ +--------v---------+ +-----v--------+ +-----v--------+ +-----v--------+ +-----v--------+
| | User | | Content Mgmt. | | Playlist | | Playback | | Search | | Recommendation |
| | Service | | Service | | Service | | Service | | Service | | Service |
| +------------+ +------------------+ +--------------+ +--------------+ +--------------+ +--------------+
| | | | | | | | |
| | | | | | | | |
| +-----v---+ +-------v----+ +------v-----+ +------v-----+ +------v-----+ +------v-----+
| | MongoDB | | MongoDB | | MongoDB | | MongoDB | | MongoDB | | MongoDB |
| | | | | | | | (Play Hist)| | | | |
| +---------+ +------------+ +------------+ +------------+ +------------+ +------------+
|
| +-------------------------------------------------+
| | Redis (Cache, Pub/Sub) |
| +-------------------------------------------------+

II. Service Breakdown & Composition
Here are the specific microservices we'll build, along with their responsibilities and key data models:

User & Authentication Service (user-service)

Responsibilities: User registration, login, profile management (CRUD), password hashing, JWT token generation/validation.

Key Data Models (MongoDB):

User: \_id, username, email, password_hash, roles (e.g., ['user'], ['admin']), created_at, updated_at.

Database: MongoDB

Communication:

Inbound: gRPC from API Gateway, other internal services.

Outbound: N/A (serves user data).

Content Management Service (content-service)

Responsibilities: Manage artists, albums, tracks (metadata CRUD), track play counts. Simulated file/image storage (storing URLs).

Key Data Models (MongoDB):

Artist: \_id, name, bio, image_url, created_at, updated_at.

Album: \_id, title, artist_id (refers to Artist), release_year, cover_image_url, created_at, updated_at.

Track: \_id, title, artist_id (refers to Artist), album_id (refers to Album), duration_ms, genre, audio_url (simulated path/URL), play_count (integer), created_at, updated_at.

Database: MongoDB

Caching: Redis (for frequently accessed track/album/artist metadata).

Communication:

Inbound: gRPC from API Gateway, Playback Service, Search Service, Playlist Service.

Outbound: N/A (serves content data).

Playlist Service (playlist-service)

Responsibilities: Create, view, edit, delete user playlists. Add/remove/reorder tracks in playlists. Manage playlist privacy.

Key Data Models (MongoDB):

Playlist: \_id, user_id (refers to User), name, description, track_ids (array of Track \_ids), is_public (boolean), created_at, updated_at.

Database: MongoDB

Communication:

Inbound: gRPC from API Gateway.

Outbound: gRPC to User Service (for user validation), gRPC to Content Service (for track validation/details).

Playback Service (playback-service)

Responsibilities: Simulate music playback (play, pause, resume, get status). Track user's current playback state. Log play history.

Key Data Models (MongoDB for history):

PlayHistory: \_id, user_id, track_id, played_at.

Ephemeral State (Redis): Stores user_id -> current_track_id, current_position_ms, is_playing.

Communication:

Inbound: gRPC from API Gateway.

Outbound: gRPC to Content Service (to get audio URL, increment play count), Redis Pub/Sub (to broadcast playback status).

Search Service (search-service)

Responsibilities: Provide comprehensive search functionality across artists, albums, and tracks. Apply filters and sorting.

Key Data Models: (None directly, queries Content Service's data).

Database: Queries Content Service's MongoDB data via gRPC.

Communication:

Inbound: gRPC from API Gateway.

Outbound: gRPC to Content Service.

Recommendation Service (recommendation-service)

Responsibilities: Provide basic content recommendations (e.g., similar artist, similar genre, tracks from recently played artists).

Key Data Models: (None directly, queries Content Service's data and Playback History).

Database: Queries Content Service's MongoDB data, Playback Service's PlayHistory data via gRPC.

Communication:

Inbound: gRPC from API Gateway.

Outbound: gRPC to Content Service, gRPC to Playback Service.

API Gateway (api-gateway)

Responsibilities: Single entry point for all client requests. Route REST requests to appropriate gRPC microservices. Handle JWT authentication and authorization. Implement rate limiting. Aggregate data from multiple services for client views. Manage WebSocket connections for real-time updates.

Technologies: Node.js, Express.js.

Communication:

Inbound: HTTP/REST from clients, Redis Pub/Sub.

Outbound: gRPC to all microservices, WebSocket to clients.

III. Project Development Flow & Phased Approach
We will follow an iterative, phased approach to build out the HarmonyStream backend. Each phase builds upon the previous one, ensuring core functionalities are stable before adding complexity.

Phase 1: Foundation & User Management (Days 1-5)

Setup monorepo, Docker Compose infrastructure.

Implement User Service with MongoDB, JWT, and basic CRUD.

Set up API Gateway for user authentication.

Phase 2: Content Management & Search (Days 6-10)

Develop Content Management Service with Artists, Albums, Tracks.

Integrate Redis caching.

Build Search Service.

Connect both to the API Gateway.

Phase 3: Playlists & Playback (Days 11-15)

Implement Playlist Service with inter-service communication.

Develop Playback Service with state tracking and history.

Integrate real-time updates via Redis Pub/Sub and WebSockets.

Phase 4: Enhancements & New Service (Days 16-20)

Introduce Recommendation Service.

Implement advanced API Gateway features (rate limiting, aggregation).

Focus on robustness, error handling, and structured logging.

Phase 5: Finalization & Polish (Days 21-22)

Comprehensive testing, documentation, and code cleanup.
