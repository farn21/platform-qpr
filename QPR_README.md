Deploy Simplified to QPR

You need to configure the .env variables 

```ini
API_ROOT=
FLAVOR=
MAPBOX_TOKEN=
MAP_PROVIDER_TOKEN=
DEPLOY_DOMAIN=mapaqpr.farn.org.ar
DEPLOY_REGION=us-east-2
AWS_ACCESS_KEY_ID=your access key
AWS_SECRET_ACCESS_KEY=your secret access key
ENABLE_CLOUDFRONT=true
```
and then run

```bash
npm run simple-deploy
```

This builds not production to www and then runs the deploy to s3 only without cloudfront and certificates checkings 

## Run local 

```bash
FLAVOR=quepasa npm start
```
