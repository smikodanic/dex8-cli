# DEX8 CLI
> DEX8 CLI is a command line interface which helps developers to create and execute Dex8 Tasks (automated serverless scripts).


## Core Api
The mainApi is used for login, upload task, download task and update the task on the Dex8 Serverless Platform
Define Main API URL:

```bash
export DEX8_MAINAPI="http://localhost:8001"
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


#### Error Solution
If you get error: "npm ERR! could not determine executable to run" when *$ npx dex8 ...* command is used do this:
```bash
$ rm -rf .git/hooks
$ npm install
```


## Commands
Initiate, delete, start, upload and download tasks from command line.

#### $ dex8 init &lt;taskName&gt;
Use this command to start a new project (Dex8 Task). It will create a taskName folder with initial files.
a) After init, move to created directory to continue using dex8 commands: *$ cd taskName*
b) Open "manifest.json" file and modify title to taskName.

#### $ dex8 login
Login to Dex8 Web Panel with your username and password. After successfully logging in, a "conf.js" file is created. It contains a JWT Authentication Token and other sensitive data so please include it in .gitignore and NEVER push this file in the git repository.

#### $ dex8 logout
Logout from Dex8 Web Panel. It is highly recommended to logout every time development work is finished because it will delete the "conf.js" file.

#### $ dex8 delete &lt;taskName&gt;
Delete a Dex8 task. This command will delete the whole taskName folder. Curent working directory can be either in taskName or in its upper, parent directory.

#### $ dex8 start -i input.json -l library.js
When a task is created use this command to run a Dex8 task locally. Echo messages will be printed in terminal.
```
Options:
-i --input  <input.js | input.json>      select input file (initial data for Dex8 task)
-l --library  <library.js>      select library file (initial libs for Dex8 task)
```

#### $ dex8 upload
Upload the task on the Dex8 serverless platform.
```
Alias:
$ dex8 u <taskName>

Options:
To use options position current working directory to folder above taskName.
-t --task  <taskName>      upload task by task name
-a --all                       upload all tasks
```

#### $ dex8 update
Update task details without uploading the task files.
This command will read what is written in "manifest.json" and "howto.html" and update the task.
Althgough same can be done with "$dex8 upload" this is much faster because it will not change files.
The position have to be in the task's folder.


#### $ dex8 download &lt;task_id&gt;
Download task files by task_id. Parameter task_id can be found in Web Panel / Tasks table.
This command will first delete all files in the folder and then create new, downloaded files.
Login is required before using this command e.g. "conf.js" file must be created.

```
Alias:
$ dex8 d
```


## Documentation
Documentation is available at [https://www.dex8.com/docs/cli](https://www.dex8.com/docs/cli) .


### Licence
The software is licensed under [AGPL-3.0](./LICENSE) .
