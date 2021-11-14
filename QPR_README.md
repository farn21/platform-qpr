Deploy Simplified to QPR

You need to configure the .env variables 

```ini
API_ROOT=
FLAVOR=
MAPBOX_TOKEN=
MAP_PROVIDER_TOKEN=
DEPLOY_DOMAIN=mapaqpr.farn.org.ar
DEPLOY_REGION=us-east-2
AWS_ACCESS_KEY_ID=AKIAWOF7YD2GFRPAKNJG
AWS_SECRET_ACCESS_KEY=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
ENABLE_CLOUDFRONT=false # This is the most important because we dont use cloudfront rigth now
```
and then run

```bash
npm run simple-deploy
```

This builds not production to www and then runs the deploy to s3 only without cloudfront and certificates checkings 
