# ¿Qué pasa, Riachuelo? (QPR)

¿Qué pasa, Riachuelo? (QPR) is the result of the collective effort of the Fundación Ambiente y Recursos Naturales (FARN), Universidad Nacional de San Martín (UNSAM) and other actors that have collaborated and participated in different activities within the framework of the project "CoAct Social Citizen Science for Collective Action" since 2020. This global initiative, funded by the European Union, aims to promote citizen science to advance actions towards environmental justice in the Matanza-Riachuelo Basin. For further information, please see https://coactproject.eu/

QPR allows users to share their experiences using forms and to visualise public information displayed on an interactive multi-layer map. 

### Background

QPR is a fork of Mapseed, a community-driven map platform based on Shareabouts (developed by OpenPlans). Previous versions of QPR inspired Mapseed development in 2016. 


This module, platform-qpr, is the tool for creating the maps. The api module collects the user reports on the backend.

### Usage

In order to collect and store user reports, the map must be configured to connect to an API backend. By default, map flavors are configured to connect to a hosted development API for testing purposes.

### Configuring

To customize your map with everything from the input form you want users to complete to the extra data you want to display, you'll edit your flavor's config.json file. For more information on the configuration process and what options are available, see the config documentation.

Running your map in a browser
If you want to see your map in action, simply run:

FLAVOR=<flavor> npm start
where <flavor> should be replaced with the name of a map flavor.

By default, this will serve your map at http://localhost:8000, but will not perform localization (should your map have multiple languages). To build a production bundle with localizations suitable for deployment, run:

FLAVOR=<flavor> npm run build
Alternatively, to build a production bundle and also start the development server at http://localhost:8000, run:

NODE_ENV=production FLAVOR=<flavor> npm start
By default, this will output all production files to a folder called www in the root of the project. This folder will contain all the assets required to deliver your map to users. Furthermore, the assets output to www will be entirely static, meaning they won't require a server to host, and can be made available via a static site hosting service such as AWS's S3.


### Using the in-app editor

Mapseed includes an in-app editor that you can use to update and hide places and comments on a per-dataset basis. Only authenticated administrators are allowed to make edits. Authentication is performed via third-party social media services (Twitter, Facebook, and Google+ are currently supported), so administrators will need an account on one of these services to use the editor.

Follow these instructions to grant administrator privileges to one or more users:

If the user to whom you'd like to grant administrator privileges has previously logged into your app via a social media service, skip to the next step. Otherwise, you'll need to manually add the user before granting privileges. Follow these steps:

In the admin panel, click Users, then Add user +, then create a new User. The username you enter here is arbitrary, although for convenience it may match the social media username of the person to whom you'd like to grant administrator privileges. Note that you may add several user social auths under a single User.

Next, in the User social auths panel, click Add user social auth +, select the User you just created under User (or choose an existing User), enter the name of the social service provider (twitter, facebook, or google-oauth2), then enter the social user's Uid. The Uid can be looked up online: here for Twitter, and here for Facebook. For Google, the Uid is the user's email address.

In the Django admin panel, click on Data sets and then the name of the dataset you'd like to grant administrator privileges for.

Under the Groups section, create a new group called administrators if it doesn't already exist. Note that this group must be called administrators.

Add users to whom you'd like to grant privileges by selecting the user in the Available submitters panel and clicking the right arrow to move them to the Chosen submitters panel.

Click Edit permissions below the submitters panels, and grant retrieve, create, update, and destroy privileges. Also make sure that a * character is entered in the text box at left. The help text in the admin panel suggests that this box can be left blank, but this is in fact not true.

Click Save.

Now when any of the Chosen submitters are logged into your app via a social media service, an edit button will appear on place detail views that belong to datasets where they have administrator privileges. Administrators can edit the title and content of places, edit and delete individual comments, and hide entire places.

### Build and deploy

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
npm install
npm run simple-deploy
```

This builds not production to www and then runs the deploy to s3 only without cloudfront and certificates checkings 

## Run local 

```bash
FLAVOR=quepasa npm start
```

### Maintainers

@farn21

### Contribute

Questions and issues should be filed right here on GitHub.

### Credits  

Many features have been powered by Mapseed and Shareabouts. 

### License

GNU GPL v3
