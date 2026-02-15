
GCC³
====

GCC³ web development repository.  


Dependencies
------------

Node.js https://nodejs.org/en/docs  
React https://react.dev/reference/react  
Webpack https://webpack.js.org/guides/  
Babel https://babeljs.io/docs/  


Install
-------

```bash
npm install
```


Development
-----------

Run the development server with hot reload:

```bash
npm run start-dev
```

This will start the webpack dev server at http://localhost:9500/


Serve
-----

Build the project for production:

```bash
npm run build
```

This generates the bundled `main.js` file in the `public/` directory.
Serve the `public/` directory with a static file server.
