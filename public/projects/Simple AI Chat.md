
Simple AI Chat
==============


Simple AI Chat is now avaiable at [simple-ai.io](https://simple-ai.io)  

A dialogue application implemented based on OpenAI's API.  
The backend of which can be customizable.  


Main Features
-------------

Commands are supported, use `:help` to show commands.  

* Dictionary search  
A local dictionary will be used as messages to let AI reference to enhance the AI response quality.  
To check/add entry use `:entry list`, `:search [keyword]`, and `:entry add`. 

* Function calling  
Support for [function calling](https://openai.com/blog/function-calling-and-other-api-updates), the AI can call the function itself, and with the description it can know when to use the function. Amazing!  
To list available functions, use `:function ls`  
To execute a function from input, use `!function_name(argument=value)`  
Example: `!get_weather(localtion=Tokyo)`  

* Session  
Use `:info` to check the current session ID, and attach the session with `:session [session_id]` to continue the previous talk.  
Use `:log` to show the current conversation history.  

* Roleplay  
To use roleplay, simply type `:role use [role_name]`.  
Use `:role list` to check current available roles.  
Prompts provided by the Awesome ChatGPT Prompts  

* Self Result Evaluation  
I found that the AI can evaluate the result of itself very well.  
And this can solve the credibility problem in dictionary searches.  
To show the stats information includings the self result evaluation use `:stats on`.  

* Location Service  
Use the device location to enhance the geology location based questions (like weather or time).  
To enable use `:location on`  

* Speak  
Use `:speak on` to turn on the speak after generating.  
Use `:speak stop` to stop the speaking.  
To change language use `:lang use [language code]`  

* AI links to AI (experimental)  
Use function calling to link to another AI (core AI)  


Command-line Run
----------------

1. Install `node` and `npm`  
2. Install [carbonyl](https://github.com/fathyb/carbonyl)  
`npm install --global carbonyl`  
3. Run `carbonyl https://simple-ai.io`  

Or, use docker  

1. Install docker
2. Run `docker run -ti fathyb/carbonyl https://simple-ai.io`  

Have fun!  


Some Challenging Fun Tasks
--------------------------

1. Intergrate LangChain to support document query. (In progress)  
2. Generate image from the stable-diffusion AI.  
3. AI links to AI. (In progress)  
