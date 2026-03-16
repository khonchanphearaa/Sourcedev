# Sourcedev 
This small platform offical communicatons with collaborator team, That focuse base one open source post aticles is soruce code in Github respository.

## How to Get Started
Clone the repository and install dependencies

```bash
https://github.com/yourname/Sourcedev.git
cd sourcedev
npm install
```

Run the setup script to configure your environment variables, initialize the database, and populate it with sample data:

```bash
npm run setup
```

This script will:

- Create a ```.env``` two both Fronted and Backend
- Connection database ```Mongodb``` 
- Secret key provide genearte 
- NODE_ENV=development
- Expires jwt


### The baseUrls productions

- Backend service
```bash
https://sourcedev.onrender.com/api
```
- Fronted service
```bash
https://sourcedev.vercel.app
```