
Simple AI Chat
==============

[live demo](https://simple-ai-chat.gcc3.com).  

A dialogue application implemented based on OpenAI's API, the backend of which can be customizable.  

* Commands are supported  

Use `:help` to show commands.  

* Main features  

1. Session  
You can use `:info` to check current session ID, and attach session with `:session [session_id]` to continue previous talk.  
Use `:log` to show the current conversation history.  

2. Dictionary search  
A local dictionary will be used as `messages` to let AI reference to enhance the AI response quality.  
To check/add entry use `:entry list`, `:search [keyword]`, and `:entry add`.

3. Roleplay   
To use roleplay, samply type `:role use [role_name]`.  
Use `:role list` to check current avaiable roles.  
Promopts provided by the [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts)

* Commandline run

1. Install `node` and `npm`  
2. Install [carbonyl](https://github.com/fathyb/carbonyl)  
`npm install --global carbonyl`  
3. `carbonyl https://simple-ai-chat.gcc3.com`  
Have fun!  

* Todos  

Extract keywords to imporve searching.  
AI links to AI.  
