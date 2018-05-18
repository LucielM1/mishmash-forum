# WORK IN PROGRESS

# YelpCamp
The bulk of this *'Yelp-like'* CRUD web app was built during [Colt Steele's The Web Developer Bootcamp](https://www.udemy.com/the-web-developer-bootcamp/) and I further enhanced and styled where I saw fit.

## Key technologies
* MongoDB / Mongoose
* Node.js / Express with RESTful routing
* Passport authentication via Passport-Local-Mongoose
* HTLM5 / CSS3 / EJS / Bootstrap 3
* Google Maps API for geocoding and map
* Cloudinary API for storing uploaded images

## Local setup
**Please note that in order to run this app locally, you must satisfy the following dependencies:**

* Install MongoDB (locally or use a hosted service like [mLab](https://mlab.com/)
* Obtain a [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
* Register for a [Cloudinary account](https://cloudinary.com/users/register/free)

### Cloning and installing dependencies
```
git clone https://github.com/jbagio/yelp-camp.git
```

```
cd yelp-camp
```

```
npm install
```

### Environment variables

Add the following variables to your `.env` file.

The key that admin users will need to input while registering.
```
ADMIN_CODE=your_key
```

The secret used by [express-session](https://github.com/expressjs/session) to sign cookies. For greater security, use a randomly generated string of (at least 30) characters.
```
SESSION_SECRET=your_key
```

The connection URI to your MongoDB database. **Note** that if not set, the app will default it to ```mongodb://localhost/yelpcampdb```
```
DATABASE_URI=your_uri
```
```javascript
const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost/yelpcampdb';
```

Your [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
```
GOOGLEMAPS_API_KEY=your_key
```

Cloudinary cloud name, API Key and API Secret. You can obtain them from your [Account Details](https://cloudinary.com/console) area.
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
