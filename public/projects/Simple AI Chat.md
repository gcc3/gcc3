
Simple AI
=========

Simple AI (`simple-ai-chat`) is a command-based AI chat application that supports both the web and CLI, aimed at providing users with an easy and simple AI experience.
It can use advanced large language models (LLMs) from multiple companies: OpenAI, xAI, Google AI, Anthropic, and Ollama models.

Text generation, image generation, and vision models are supported.
Features like function calling and the Model Control Protocol (MCP) are also supported.

The application is deployed at [simple-ai.io](https://simple-ai.io).  


Quick Start
-----------

Web use  
https://simple-ai.io

Command-line interface (CLI) use  
Install: npm i simple-ai-chat -g  
Start: schat  
npm package: simple-ai-chat  

MCP client  
Install: npm i simple-ai-chat -g  
Use smcp (or just schat) to start the client service.  
The mcpconfig.json file is located in the ~/.simple.  

Ollama  
Set the environment variable OLLAMA_ORIGINS to * or your domain to allow CORS.  
Use :model ls to list the models, and :model use <model> to use the Ollama models.  
To use function calling, set :stream off as in Ollama it's not supported.  


Features
--------

- Text Generation  
Chat with the state-of-the-art LLM powered by OpenAI, xAI, Google, Anthropic, Ollama and more...

- GPT Vision  
Interact with powerful vision models. To use Vision model, paste or drag and drop the image to the input box.

- Image Generation & Edit  
Generate beautiful images using prompts, and edit generated or uploaded images, or combine images to one image based on your instructions.

- Model Context Protocol (MCP)  
Simple AI functions as a Model Context Protocol (MCP) client. Connect to MCP servers to access a wealth of data and applications.

- File Input  
Upload files (supporting plain text, DOCX, PDF, JSON), and they will be processed as text. The results will be inserted into the prompt and will provide a GPT reference.

- Roles  
Allow GPT to act as a role to provide more satisfactory answers. You can either use pre-defined system roles or create custom instruction prompts to tailor user roles to your specific requirements.

- Data Stores  
Support for files and relational database queries. If a store is used, the query results will be inserted as prompts to provide knowledgeable answers. Multiple data stores can be used simultaneously.

- Nodes (Node AI)  
Connect to another AI or any data source to use its data. When a node is used, the results will be utilized as prompts provided for the AI.

- Enhanced Knowledge & Mathematics (WolframAlpha)  
As one of the AI callable function, WolframAlpha is a highly capable computational knowledge engine that enhances the reliability of answers provided.

- Command-line Interface (CLI)  
Command-line interface software is provided via the Node Package Manager (npm) and supports the same features as the web UI.
More features:

- Full-screen mode and split-screen mode  
For easy use requiring extensive input and output, such as programmers, essay writer. To use split-screen mode, use command `:fullscreen split`.

- De-hallucination  
Detect hallucinations in chat to provide more trustworthiness. When the AI exhibits hallucination, it can sometimes generate completely fabricated answers. By enabling the dehallucination feature, a message in stats (`self_eval_score`) will be displayed along with statistics to allow users to judge the accuracy of the information. Essentially, this feature resends the user's input and the AI's output, along with reference information, back to AI for self-evaluation. Use command `:stats on`, and `:eval on` to turn on it.

- TTS voice  
Reading with an option to select from the system's local TTS voice library, use command `:speak on` to enable.

- Themes  
Supports 3 themes: Light mode, Dark mode, and Matrix-style Terminal mode.

- Function calls  
GPT will choose function to use to get information it needs. Such as weather and time queries. Functions can be called by user directly from the input as well. To list all available functions use `:function ls`. Also refer: Functions

- Page redirection  
As one of the `functions calls`, `redirect_to_url()` can redirect or open URL in a new tab. GPT will do it automatically, for example: Open the official website of OpenAI. You can use it to open multiple URLs, simultaneously.

- Location-based query  
Questioning based on user's geographic location information. e.g., answering `How's the weather today?` by automatically obtaining the location. To use location feature, use command `:location on`.

- Code highlighting  
Code highlighting for different themes, support all programming languages.

- Mathematical Equation  
Supports the display of mathematical equations in LaTeX format in the results. When user copy the text in equation, the original LaTeX will be copied.

- Shortcuts  
Supports convenient shortcut operations. Refer: `Shortcuts`

- Internationalization and localization  
Simple AI supports 18 languages: Arabic, Bengali, Chinese, Dutch, English, French, German, Hindi, Indonesian, Italian, Japanese, Korean, Polish, Portuguese, Russian, Spanish, Swedish, Turkish. Please let us know if you need support for your language.
