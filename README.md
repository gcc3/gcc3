
Content Hub
===========


Light weight content hub, originally developed for [gcc³.com](https://gcc3.com) web.  
It can be used as a blog system, content server , document server, etc...  

Features:  
Use Markdown to write text files, auto indexing.  
Load in realtime.  


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
Category folders and note files will be loaded to index.  

Scripts  
`pull.sh`
pull the source code and the content, recursively.  
`push-notes.sh`  
Push all notes recursively.  
If you want to edit the notes directly on the server.  


Content String
--------------

String with format of `[type]category:note` is used to indicate the content to load.  
Example: `http://gcc3.com/?content=[note]projects:simple ai.md`  

Format: `[type]category:note`  
Example:  
`[category]Life:` indicates to load the category `Life`.  
`[note]Life:Note1` indicates to load the note `Note1.md` in the category `Life`.  

1. `type`  
Load types.  
`type` can be `category`, `note`, `categories`.  
`[note]` indicates to load the note.  
`[category]` indicates to load the category.  
`[categories]` indicates to load all categories.  

2. `category`  
`category` is the exact folder name.  

3. `note`  
`note` is the exact relative path of the file, relative to the category folder.  
e,g: `Note1.md` or `.markdown/Note1.md`.  

- `.markdown` is a subfolder in the category folder
Refer [.note](https://github.com/lhypds/.note)  

- Root-level content  
To load the root folder or note in root folder.  
Use `[category]__root__:` or `[note]__root__:note_name`.  


Development
-----------

Dependencies  
Node.js https://nodejs.org/en/docs  
React https://react.dev/reference/react  
Webpack https://webpack.js.org/guides/  
Babel https://babeljs.io/docs/  

Develop the project:  
`npm install` and `npm run dev`  

For APIs refer `src/serve.js`  


.env
----

PORT  
Used to set the web and content server port.  
Default is 3180.  

REACT_APP_NAME  
Used to set the site name.  

REACT_APP_COPYRIGHT  
Used to set the site copyright information.  

REACT_APP_LINKS  
Used to set the site links in the format of `name1:url1,name2:url2`.  

REACT_APP_USE_SEARCH  
Enable search.  

REACT_APP_USE_REALTIME  
Enable realtime update with SSE.  

REACT_APP_DEFAULT_CONTENT  
Used to set the default load content.  

