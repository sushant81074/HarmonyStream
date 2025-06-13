# HarmonyStream

HarmonyStream: A Spotify-like Music Streaming Platform
Project Goal: To build a core, functional, and scalable backend for a music streaming service, demonstrating a microservices architecture using Node.js, gRPC, Express, MongoDB, and Redis.

Timeline: Approximately 1 Month (22 Working Days, assuming 5 days/week)

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

IV. Detailed Day-by-Day Project Map (22 Days)
Tools & Technologies (Common to all services unless specified):

Node.js (LTS version)

Express.js (for API Gateway)

@grpc/grpc-js, @grpc/proto-loader

MongoDB (Mongoose ODM)

Redis (Node-Redis client)

jsonwebtoken, bcrypt

ws (for WebSockets in API Gateway)

winston (for logging)

express-rate-limit (for API Gateway)

Docker, Docker Compose

Git for version control

Phase 1: Foundation & User Management (Days 1-5)
Day 1: Project Setup & gRPC Basics

Focus: Initializing project structure and understanding gRPC fundamentals.

Tasks:

Create root project directory (harmonystream).

Initialize a monorepo structure (e.g., using lerna or simple nested folders: services/user-service, services/api-gateway, protos, docker-compose.yml).

Setup user-service: npm init, install @grpc/grpc-js, @grpc/proto-loader, dotenv.

Create protos/user.proto (simple RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, GetUserProfileRequest, GetUserProfileResponse).

Implement a basic gRPC server in user-service for RegisterUser (dummy logic for now).

Create a simple Node.js client script to call RegisterUser on user-service.

Expected Outcome: Working gRPC server and client communication for a dummy user registration.

Integration: None yet.

Day 2: User Service - MongoDB & JWT

Focus: Integrating database and authentication.

Tasks:

In user-service: Install mongoose, bcrypt, jsonwebtoken.

Configure MongoDB connection (using environment variables).

Define User Mongoose schema (username, email, password hash, roles).

Implement RegisterUser gRPC method to hash password with bcrypt and save to MongoDB.

Implement LoginUser gRPC method: verify password with bcrypt, generate JWT token upon success.

Expected Outcome: User registration and login working with persistence and JWT.

Integration: user-service now connects to MongoDB.

Day 3: User Service - Profile & Robustness

Focus: Completing user functionalities and adding basic error handling.

Tasks:

In user-service: Implement GetUserProfile gRPC method to fetch user data.

Add basic password reset (e.g., generate/validate a temporary token for simplicity, no email actual sending).

Implement basic error handling for gRPC methods (e.g., return grpc.status.UNAUTHENTICATED, NOT_FOUND).

Add logging (e.g., winston) to user-service.

Expected Outcome: Full user CRUD operations via gRPC with error handling and logging.

Integration: N/A.

Day 4: API Gateway - User Authentication & Routing

Focus: Exposing user authentication via REST and integrating with user-service.

Tasks:

Setup api-gateway: npm init, install express, cors, jsonwebtoken.

Configure gRPC client for user-service within api-gateway.

Create REST endpoints: POST /auth/register, POST /auth/login. These endpoints will call the corresponding user-service gRPC methods.

Implement JWT verification middleware in api-gateway (e.g., for GET /profile endpoint).

Expected Outcome: Clients can register/login via REST, and access protected routes.

Integration: api-gateway communicates with user-service via gRPC.

Day 5: Dockerization (Initial) & RBAC

Focus: Containerizing initial services and setting up role-based access.

Tasks:

Create Dockerfile for user-service and api-gateway.

Create docker-compose.yml to run MongoDB, user-service, and api-gateway.

Define network for services in docker-compose.yml.

In user-service: Implement roles field for users.

In api-gateway: Implement a simple RBAC middleware to restrict certain routes (e.g., /admin only accessible by 'admin' role).

Expected Outcome: Entire user authentication system running in Docker containers. RBAC functional.

Integration: All core services are now containerized and running together.

Phase 2: Content Management & Search (Days 6-10)
Day 6: Content Management Service - Artists & Albums

Focus: Building content metadata management.

Tasks:

Create content-service directory. npm init, install mongoose, @grpc/grpc-js, @grpc/proto-loader.

Create protos/content.proto (for Artist, Album, Track CRUD).

Define Mongoose schemas for Artist and Album.

Implement gRPC methods for CreateArtist, GetArtist, CreateAlbum, GetAlbum, ListAlbumsByArtist.

Expected Outcome: Content service can manage artist and album data in MongoDB.

Integration: content-service now connects to MongoDB.

Day 7: Content Management Service - Tracks & Redis Caching

Focus: Managing tracks and introducing caching.

Tasks:

In content-service: Define Mongoose schema for Track (including audio_url, image_url, play_count).

Implement gRPC methods for CreateTrack, GetTrack, ListTracksByAlbum, ListTracksByArtist.

Install node-redis. Configure Redis client in content-service.

Implement read-through caching for GetTrack, GetAlbum, GetArtist (check cache first, if not found, fetch from DB and store in cache).

Implement cache invalidation/update on Create/Update/Delete operations for these entities.

Expected Outcome: Content service managing tracks, with Redis caching for performance.

Integration: content-service now uses Redis.

Day 8: API Gateway - Content Management Integration

Focus: Exposing content via REST and integrating search.

Tasks:

In api-gateway: Configure gRPC client for content-service.

Add REST endpoints: POST /artists, GET /artists/:id, GET /artists/:id/albums, POST /albums, GET /albums/:id, GET /albums/:id/tracks, POST /tracks, GET /tracks/:id.

Ensure relevant content routes are protected by JWT middleware.

Expected Outcome: Full CRUD for content available via API Gateway.

Integration: api-gateway communicates with content-service.

Day 9: Search Service - Basic Implementation

Focus: Building initial search capabilities.

Tasks:

Create search-service directory. npm init, install @grpc/grpc-js, @grpc/proto-loader.

Create protos/search.proto (e.g., SearchRequest, SearchResponse containing lists of Artist, Album, Track stub data).

In search-service: Configure gRPC client for content-service.

Implement Search gRPC method: receive query, make gRPC calls to content-service (e.g., ListArtists, ListAlbums, ListTracks) and filter results in memory (case-insensitive title/name matches).

Expected Outcome: Search service can return basic results.

Integration: search-service communicates with content-service.

Day 10: API Gateway - Search & Docker Compose Update

Focus: Making search accessible and updating Docker orchestration.

Tasks:

In api-gateway: Configure gRPC client for search-service.

Add REST endpoint: GET /search?q={query}. This endpoint calls search-service via gRPC.

Update docker-compose.yml to include content-service and search-service. Ensure all services can communicate.

Test the full flow: api-gateway -> search-service -> content-service -> MongoDB/Redis.

Expected Outcome: Search feature functional via API Gateway, all services containerized.

Integration: api-gateway integrates with search-service, content-service integrated into Docker.

Phase 3: Playlists & Playback (Days 11-15)
Day 11: Playlist Service - Basic CRUD

Focus: Initial playlist management.

Tasks:

Create playlist-service directory. npm init, install mongoose, @grpc/grpc-js, @grpc/proto-loader.

Create protos/playlist.proto (for Playlist CRUD, AddTrackToPlaylist, RemoveTrackFromPlaylist, ReorderTracksInPlaylist).

Define Playlist Mongoose schema (user_id, name, description, track_ids, is_public).

Implement gRPC methods for CreatePlaylist, GetPlaylist, ListUserPlaylists.

Expected Outcome: Playlist service can manage basic playlists.

Integration: playlist-service now connects to MongoDB.

Day 12: Playlist Service - Inter-Service Validation

Focus: Ensuring data integrity across services for playlists.

Tasks:

In playlist-service: Configure gRPC clients for user-service and content-service.

Implement AddTrackToPlaylist gRPC method:

Validate user_id exists via user-service.

Validate track_id exists via content-service.

Add track to playlist.

Implement RemoveTrackFromPlaylist similarly.

Implement SetPlaylistPrivacy, ReorderTracksInPlaylist.

Expected Outcome: Playlist operations are validated against existing users and tracks.

Integration: playlist-service communicates with user-service and content-service.

Day 13: Playback Service - Basic Play & History

Focus: Simulating music playback and tracking history.

Tasks:

Create playback-service directory. npm init, install mongoose, @grpc/grpc-js, @grpc/proto-loader, node-redis.

Create protos/playback.proto (for PlayTrack, PauseTrack, ResumeTrack, GetPlayingStatus).

In playback-service: Configure gRPC client for content-service.

Define PlayHistory Mongoose schema (user_id, track_id, played_at).

Implement PlayTrack gRPC method: Fetch track details from content-service, simulate playback (log), save to PlayHistory in MongoDB. Increment play_count for the track in content-service via gRPC.

Implement GetPlayingStatus (return dummy status for now).

Expected Outcome: Playback simulation and history logging.

Integration: playback-service communicates with content-service and its own MongoDB.

Day 14: Playback Service - Redis State & Real-time Pub/Sub

Focus: Managing real-time playback state and publishing updates.

Tasks:

In playback-service: Use Redis to store real-time playback state (current track, position, playing/paused status) for each user.

Implement PauseTrack, ResumeTrack to update Redis state.

Implement Redis Pub/Sub: When playback status changes (play, pause, resume), publish a message to a Redis channel (e.g., playback_updates).

Expected Outcome: Real-time playback state stored in Redis, and changes published via Pub/Sub.

Integration: playback-service uses Redis Pub/Sub.

Day 15: API Gateway - Playlists, Playback & WebSockets

Focus: Exposing playback and playlist features, setting up real-time updates.

Tasks:

In api-gateway: Configure gRPC clients for playlist-service and playback-service.

Add REST endpoints: POST /playlists, GET /playlists/:id, GET /users/:id/playlists, POST /playlists/:id/tracks, etc.

Add REST endpoints for playback: POST /play, POST /pause, POST /resume, GET /status.

Implement a basic WebSocket server (ws library) in api-gateway.

Subscribe API Gateway to Redis playback_updates channel. When messages arrive, push to relevant connected WebSocket clients.

Expected Outcome: Playlists and playback controllable via REST, real-time playback status available via WebSocket.

Integration: api-gateway integrates with playlist-service, playback-service, and Redis Pub/Sub.

Phase 4: Enhancements & New Service (Days 16-20)
Day 16: Playback Service - Play Queue

Focus: Implementing a basic play queue.

Tasks:

In playback-service: Modify playback.proto to include queue management (e.g., AddTrackToQueue, RemoveTrackFromQueue, GetQueue).

Use Redis lists or sets to manage the user's play queue.

Modify PlayTrack logic to play from the queue.

Expected Outcome: Users can manage a play queue.

Integration: playback-service uses Redis for queue.

Day 17: Recommendation Service - Basic Logic

Focus: Developing the first recommendation logic.

Tasks:

Create recommendation-service directory. npm init, install @grpc/grpc-js, @grpc/proto-loader.

Create protos/recommendation.proto (e.g., GetRecommendationsRequest, GetRecommendationsResponse).

In recommendation-service: Configure gRPC clients for content-service and playback-service.

Implement GetRecommendations gRPC method:

Fetch user's recent played tracks from playback-service.

Based on recent tracks, get related content from content-service (e.g., other tracks by same artist, or in same genre). Keep it simple.

Expected Outcome: Recommendation service can provide basic suggestions.

Integration: recommendation-service communicates with content-service and playback-service.

Day 18: API Gateway - Aggregation & Recommendations

Focus: Advanced API Gateway functionality.

Tasks:

In api-gateway: Configure gRPC client for recommendation-service.

Add REST endpoint: GET /recommendations (protected). This calls recommendation-service.

Implement a more complex API Gateway endpoint (e.g., GET /user-dashboard) that aggregates data by making multiple gRPC calls to: User Service (profile), Playlist Service (user's top playlists), Playback Service (recently played, current playing status), Recommendation Service (top recommendations).

Expected Outcome: Richer client-facing endpoints available.

Integration: api-gateway integrates with recommendation-service.

Day 19: Robustness - Rate Limiting & Enhanced Logging

Focus: Improving the system's resilience and debuggability.

Tasks:

In api-gateway: Implement global rate limiting using express-rate-limit with Redis store.

Review and enhance error handling across all services, ensuring consistent gRPC error codes and messages.

Standardize logging formats (e.g., JSON logs) and levels (info, warn, error) in all services using winston.

Expected Outcome: More resilient API Gateway, better error visibility.

Integration: Cross-cutting concerns implemented.

Day 20: Docker Compose - Full System Orchestration

Focus: Getting the entire system running seamlessly in containers.

Tasks:

Update docker-compose.yml to include playlist-service, playback-service, and recommendation-service.

Review and refine network configurations, environment variables, and dependencies in docker-compose.yml.

Perform a full docker-compose up and extensive sanity checks on all endpoints and inter-service calls.

Troubleshoot any containerization or communication issues.

Expected Outcome: All services running correctly and communicating within Docker Compose environment.

Integration: Final Docker orchestration.

Phase 5: Finalization & Polish (Days 21-22)
Day 21: Comprehensive Integration Testing

Focus: Verifying end-to-end functionality.

Tasks:

Write automated integration tests covering critical user flows (e.g., new user registers -> creates playlist -> adds track -> plays track -> gets recommendations).

Use Postman, Insomnia, or a scripting tool (like chai/mocha if you want to write JS tests) to systematically test all API Gateway endpoints.

Directly test gRPC services using client scripts to ensure internal communication is robust.

Expected Outcome: Confidence that the core application flows work as expected.

Day 22: Documentation & Cleanup

Focus: Making the project understandable and maintainable.

Tasks:

Create a detailed README.md in the root directory covering:

Project overview and architecture.

Technology stack.

Setup instructions (prerequisites, git clone, docker compose up).

How to interact with the API Gateway (key endpoints).

List of all services and their responsibilities.

gRPC service definitions (.proto files).

Future improvements/stretch goals.

Review all code for clarity, add extensive comments to complex logic.

Remove any dead code or temporary files.

Expected Outcome: A well-documented, clean, and runnable HarmonyStream backend project.

This detailed project map should provide you with a clear roadmap for your "HarmonyStream" project. Remember to stay flexible, address challenges as they arise, and celebrate your progress daily. Good luck!
