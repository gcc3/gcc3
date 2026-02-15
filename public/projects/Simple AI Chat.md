
simple ai - chat
================


[https://simple-ai.io](https://simple-ai.io)  

GitHub: [gcc3/simple-ai-chat](https://github.com/gcc3/simple-ai-chat)  

Simple AI (`simple-ai-chat`) is a command-based AI chat application that supports both the web and CLI, aimed at providing users with an easy and simple AI experience.
It can use advanced large language models (LLMs) from multiple companies: OpenAI, xAI, Google AI, Anthropic, and Ollama models.

**Key Features:** Text generation • Image generation & editing • GPT Vision • Model Context Protocol (MCP) • Function calling • File input (TXT, DOCX, PDF, JSON) • Roles & custom prompts • Data stores & databases • Node AI connections • WolframAlpha integration • Full-screen & split-screen modes • De-hallucination detection • TTS voice • Multiple themes • Location-based queries • Code highlighting • LaTeX equations • 18 language support

- Command-line interface (CLI) use  
Install: npm i simple-ai-chat -g  
Start: schat  
npm package: simple-ai-chat  

- MCP client  
Install: npm i simple-ai-chat -g  
Use smcp (or just schat) to start the client service.  
The mcpconfig.json file is located in the ~/.simple.  

- Ollama  
Set the environment variable OLLAMA_ORIGINS to * or your domain to allow CORS.  
Use :model ls to list the models, and :model use <model> to use the Ollama models.  
To use function calling, set :stream off as in Ollama it's not supported.  
