
gcc³
====


Light weight blog application.  
Used by [gcc³](https://gcc3.com) web.  


How To Use
----------

Setup  
`npm install` to install packages.  
Setup `.env` from `.env.example` and fill in the required values, refer `.env` section below.  
(Optional) Add `favicon.ico` in the `public/` directory.  

Serve  
Build the project for production:  
`npm run build`  
This generates the bundled `main.js` file in the `public/` directory.  
Serve the project with Express:  
`npm start`  
You can use PM2 to keep the server alive:  
`pm2 start ecosystem.config.js`  

Content  
Simply write and put the markdown files in the `notes/[category]/*.md` directory.  
Category will be loaded as indexes in sidebar.  


Development
-----------

Dependencies  
Node.js https://nodejs.org/en/docs  
React https://react.dev/reference/react  
Webpack https://webpack.js.org/guides/  
Babel https://babeljs.io/docs/  

Develop the project with hot reload:  
`npm run dev`  

This will start the webpack dev server at http://localhost:9500/  
The content server `PORT` can be set in `.env` file.  

Content server APIs  
/api/categories  
Get the list of categories.  
/api/notes/:category  
Get the list of notes in a category.  


.env
----

PORT  
Used to set the web and content server port.  
Default is 3180.  

REACT_APP_NAME  
Used to set the site name.  

REACT_APP_PUBLIC_URL  
Used to set the site public URL.  

REACT_APP_COPYRIGHT  
Used to set the site copyright information.  

REACT_APP_LINKS  
Used to set the site links in the format of `name1:url1,name2:url2`.  

REACT_APP_USE_SEARCH  
Used to enable the search page.  
