# DEX8 CLI
> DEX8 CLI is a command line interface which helps developers to create and execute DEX8 Tasks (automated serverless scripts).


## Core Api
The DEX8 Api is used for login, upload task, download task and update the task on the DEX8 Serverless Platform.

Define DEX8 API Base URI:
```bash
export DEX8API_BASEURI="http://localhost:8001"
```
Default is: https://api.dex8.com


## How to install and use
There are two ways:

- global installation

```bash
$ npm install -g dex8-cli

### Use command
$ dex8 start -i input.json
```

- local (project) installation
```bash
$ npm install --save dex8-cli

### Use command
$ npx dex8 start -i input.json
```


#### Error Fix
If you get error: "npm ERR! could not determine executable to run" when *$ npx dex8 ...* command is used do this:
```bash
$ rm -rf .git/hooks
$ npm install
```


## Commands
Initiate, delete, start, upload and download tasks from command line.


#### $ dex8 login
Login with [DEX8 Web Panel](https:panel.dex8.com) username and password. Upon successful login, a "dex8-auth.json" file is generated, housing a JWT Authentication Token and other sensitive information. Ensure its inclusion in .gitignore to prevent accidental commits to the Git repository. Never push this file to the repository !


#### $ dex8 logout
It is strongly advised to log out upon completing development tasks, as doing so will remove the "dex8-auth.json" file.


#### $ dex8 init
Initiate a new project (DEX8 Task) with this command.
Upon answering a series of questions, it will generate a folder containing the initial files.


#### $ dex8 delete &lt;taskTitle&gt;
Remove a DEX8 task with this command. It will delete the entire folder named with taskTitle argument. The command position can be either within taskTitle or its parent directory.


#### $ dex8 bundle
Bundle main.js and save it in the ./dist/mainBundle.js.
```
Alias:
$ dex8 b
```


#### $ dex8 start -i input.json -l library.js -b
Once a task is created, utilize this command to launch a DEX8 task on localhost. If inputSecret.json is specified, it will be combined with input.json, wherein inputSecret.json holds passwords and other confidential information.
```
Options:
-i --input  <input.js | input.json>      select input file (initial data for DEX8 task)
-l --library  <library.js>      select library file (initial libs for DEX8 task)
-b --bundle       execute dist/mainBundle.js instead of main.js
```


#### $ dex8 upload
Upload the task to the DEX8 SaaS Platform. Prior to uploading, bundle the main.js file using the **$ dex8 bundle** command.
```
Alias:
$ dex8 u

Options:
To use options position current working directory to folder above taskName.
-t --task  <taskName>      upload task by task name
-a --all                       upload all tasks

Examples:
$ dex8 upload                    -> if we are in the task folder
$ dex8 upload -t <taskTitle>     -> if we are in the task parent folder
$ dex8 upload --all              -> if we are in the task parent folder
```


#### $ dex8 update
Update task details without uploading the task files. This command will retrieve information from "manifest.json" and "howto.html" to update the task. While the same can be achieved with **$ dex8 upload**, this method is faster as it doesn't modify any files. Ensure the current position is within the task's folder.


#### $ dex8 download &lt;task_id&gt;
Download task files using the task_id parameter, which can be located in the Web Panel's Tasks table. This command will initially clear the folder of all files and then replace them with the newly downloaded ones. Prior to utilizing this command, login is necessary, and the "dex8-auth.json" file must be created.

```
Alias:
$ dex8 d
```


## Documentation
The documentation is available at [https://www.dex8.com/docs](https://www.dex8.com/docs) .


### Licence
The software is licensed under [AGPL-3.0](./LICENSE) .
