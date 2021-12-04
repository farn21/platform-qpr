#¿Qué pasa, Riachuelo? (QPR)#

¿Qué pasa, Riachuelo? (QPR) is the result of the collective effort of the Fundación Ambiente y Recursos Naturales (FARN), Universidad Nacional de San Martín (UNSAM) and other actors that have collaborated and participated in different activities within the framework of the project "CoAct Social Citizen Science for Collective Action" since 2020. This global initiative, funded by the European Union, aims to promote citizen science to advance actions towards environmental justice in the Matanza-Riachuelo Basin. For further information, please see https://coactproject.eu/

QPR allows users to share their experiences using forms and to visualise public information displayed on an interactive multi-layer map. 

###Background###

QPR is a fork of Mapseed, a community-driven map platform based on Shareabouts (developed by OpenPlans). Previous versions of QPR inspired Mapseed development in 2016. 


This module, platform-qpr, is the tool for creating the maps. The api module collects the user reports on the backend.

###Install###

QPR requires Node LTS.  We recommend managing node/npm versions using nvm or asdf.
To install npm dependencies:


# In project folder

npm install


###Usage### 


In order to collect and store user reports, the map must be configured to connect to an API backend. By default, map flavors are configured to connect to a hosted development API for testing purposes.

###Configuring###

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


###Deployment###

To deploy to a website, run the following script:

npm run build-deploy


The appropriate env vars for FLAVOR, MAPBOX_TOKEN , MAPQUEST_KEY, MAP_PROVIDER_TOKEN, API_ROOT, <flavor>_SITE_URL, <flavor>_GOOGLE_ANALYTICS_ID, and DEPLOY_DOMAIN must be set in the /src/.env file.

NOTE: If you are getting this error:

Error: getaddrinfo ENOTFOUND cloudfront.amazonaws.com cloudfront.amazonaws.com:443

then you may need to turn off your VPN.

NOTE: If the new bundle is not being served, then you may need to run a cache invalidation on your CDN.


###Using the Dev API###

By default, map flavors that you run locally will connect to a hosted development API. However, if you want to host your own API backend, either for testing or production purposes, it will be necessary to build your map flavors against a .env file with the necessary configuration information.

To do so, create a file at src/.env (note the . character in the filename), and add information in the following format:

API_ROOT=http://localhost:8001/api/v2/ # note trailing slash

TREES_SITE_URL=http://localhost:8001/api/v2/username/datasets/trees
RESTORATION_SITE_URL=http://localhost:8001/api/v2/username/datasets/restoration
The value of API_ROOT should match the server on which your map datasets are running, and should contain a trailing / character. If you're hosting your API on a server called api.mymap.com, for example, the value of API_ROOT would be:

API_ROOT=http://api.mymap.com/api/v2/ # note trailing slash
For each dataset that your map connects to, you'll need a line that tells the map where to find this dataset. Dataset key names should take the format <DATASET>_SITE_URL, where <DATASET> is the UPPERCASE name of the dataset referenced in the config.json file for your flavor.

Note that you can also set the FLAVOR variable in your .env file:

FLAVOR=nameflavor_flavor

Doing so will remove the need to pass this value in when your run npm start or npm run build.


###Using the in-app editor###

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


###Maintainers###

farn21

###Contribute###

Questions and issues should be filed right here on GitHub.

###Credits### 

Many features have been powered by Mapseed and Shareabouts. 

###License###

GNU GPL
