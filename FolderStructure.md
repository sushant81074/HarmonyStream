harmonystream/
├── docker-compose.yml             # Orchestrates all Docker containers (MongoDB, Redis, all services)
├── .env.example                   # Example for environment variables used across services
├── protos/                        # Centralized location for all .proto files
│   ├── user.proto                 # gRPC service and message definitions for user-service
│   ├── content.proto              # gRPC service and message definitions for content-service
│   ├── playlist.proto             # gRPC service and message definitions for playlist-service
│   ├── playback.proto             # gRPC service and message definitions for playback-service
│   ├── search.proto               # gRPC service and message definitions for search-service
│   └── recommendation.proto       # gRPC service and message definitions for recommendation-service
├── services/                      # Directory for all individual microservice projects
│   ├── api-gateway/               # Handles external REST requests, routes to gRPC services
│   │   ├── src/
│   │   │   ├── index.js           # Main Express.js application, server setup
│   │   │   ├── routes/            # Express.js route definitions
│   │   │   │   ├── authRoutes.js  # Routes for user authentication (register, login)
│   │   │   │   ├── contentRoutes.js # Routes for content (artists, albums, tracks)
│   │   │   │   ├── playlistRoutes.js # Routes for playlists
│   │   │   │   ├── playbackRoutes.js # Routes for playback controls
│   │   │   │   └── searchRoutes.js # Routes for search
│   │   │   ├── middleware/        # Express.js middleware (e.g., JWT validation, rate limiting)
│   │   │   │   ├── authMiddleware.js
│   │   │   │   └── rateLimitMiddleware.js
│   │   │   ├── clients/           # gRPC client instances for communicating with backend services
│   │   │   │   ├── userGrpcClient.js
│   │   │   │   ├── contentGrpcClient.js
│   │   │   │   ├── playlistGrpcClient.js
│   │   │   │   ├── playbackGrpcClient.js
│   │   │   │   ├── searchGrpcClient.js
│   │   │   │   └── recommendationGrpcClient.js
│   │   │   └── utils/             # Utility functions (e.g., WebSocket handler)
│   │   │       └── websocketHandler.js
│   │   ├── Dockerfile             # Dockerfile for the API Gateway service
│   │   ├── package.json           # Node.js dependencies for API Gateway
│   │   └── .env.example           # Environment variables specific to API Gateway
│   ├── user-service/              # Manages user accounts and authentication
│   │   ├── src/
│   │   │   ├── index.js           # Main gRPC server setup and startup
│   │   │   ├── services/          # gRPC service handler logic
│   │   │   │   └── userService.js
│   │   │   ├── models/            # Mongoose schemas for MongoDB
│   │   │   │   └── User.js
│   │   │   ├── config/            # Configuration files (e.g., database connection)
│   │   │   │   └── db.js
│   │   │   └── utils/             # Utility functions (e.g., password hashing)
│   │   │       └── authUtils.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   ├── content-service/           # Manages artists, albums, and tracks metadata
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── services/
│   │   │   │   └── contentService.js
│   │   │   ├── models/
│   │   │   │   ├── Artist.js
│   │   │   │   ├── Album.js
│   │   │   │   └── Track.js
│   │   │   ├── config/
│   │   │   │   ├── db.js
│   │   │   │   └── redis.js
│   │   │   └── utils/             # Utility for Redis caching
│   │   │       └── cacheUtils.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   ├── playlist-service/          # Manages user playlists
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── services/
│   │   │   │   └── playlistService.js
│   │   │   ├── models/
│   │   │   │   └── Playlist.js
│   │   │   ├── config/
│   │   │   │   └── db.js
│   │   │   └── clients/           # gRPC clients to other services needed by playlist-service
│   │   │       ├── userGrpcClient.js
│   │   │       └── contentGrpcClient.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   ├── playback-service/          # Handles playback simulation, history, and real-time state
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── services/
│   │   │   │   └── playbackService.js
│   │   │   ├── models/
│   │   │   │   └── PlayHistory.js
│   │   │   ├── config/
│   │   │   │   ├── db.js
│   │   │   │   └── redis.js
│   │   │   └── clients/
│   │   │       └── contentGrpcClient.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   ├── search-service/            # Provides search functionality
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── services/
│   │   │   │   └── searchService.js
│   │   │   └── clients/
│   │   │       └── contentGrpcClient.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   └── recommendation-service/    # Generates basic content recommendations
│       ├── src/
│       │   ├── index.js
│       │   ├── services/
│       │   │   └── recommendationService.js
│       │   └── clients/
│       │       ├── contentGrpcClient.js
│       │       └── playbackGrpcClient.js
│       ├── Dockerfile
│       ├── package.json
│       └── .env.example
├── README.md                      # Overall project README (setup, run instructions, architecture)
└── .gitignore                     # Git ignore file for node_modules, .env, etc.