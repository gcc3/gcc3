
GCC³
====


Light weight blog system.  
Used by [GCC³](https://gcc3.com) web.  


How To Use
----------

Setup  
`npm install`  
Setup `.env` from `.env.example` and fill in the required values.  
`PORT` is the content server port.  
Setup `src/constants.js` from `src/constants.example.js` and fill in the required values.  

Serve  
Build the project for production:  
`npm run build`  
This generates the bundled `main.js` file in the `public/` directory.  
Serve the project with Express:  
`npm start`  

The frontend and API are served from the same Express server and port.  

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
