
window color rotator
====================


<img src="/assets/window-color-rotator/icon.png" alt="Window Color Rotator Icon" width="100px" />

VS Code Extension to colorize the window for different projects.  

Marketplace: [gcc3.window-color-rotator](https://marketplace.visualstudio.com/items?itemName=gcc3.window-color-rotator)  
GitHub: [vscode-window-color-rotator](https://github.com/lhypds/vscode-window-color-rotator)  

Window Color Rotator is a Visual Studio Code extension that helps you visually distinguish different projects by giving each VS Code window its own color scheme. Instead of manually tweaking UI colors every time, you can click a status bar button or run a command to `rotate` to the next preset color, and the extension applies that color to the current workspace.  

It works by writing a `workbench.colorCustomizations` block into your project’s `.vscode/settings.json`, changing elements like the title bar and status bar colors. At the same time, it stores a mapping of project path → selected color in a shared configuration file (`colors.json`) in the extension’s global storage. When you reopen a project later, the extension checks that mapping and automatically re-applies the previously chosen color so each project stays consistent.

It also includes commands to clear the color for the current project, reset all saved project-color assignments, and open/customize the `colors.json` presets so you can define your own color sets.
