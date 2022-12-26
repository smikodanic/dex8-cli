# MIKROS CLI
> Mikros CLI is a command line interface which helps developers to create and execute Mikros Tasks (automated serverless scripts).


## Core Api
The mainApi is used for login, upload task, download task and update the task on the Mikros Serverless Platform
Define Main API URL:

```bash
export MIKROS_MAINAPI="http://localhost:8001"
```

Default is: https://api.mikros.io


## How to install and use
There are two ways:

- global installation

```bash
$ npm install -g mikros-cli

### Use command
$ mik start -i input.json -s
```

- local (project) installation
```bash
$ npm install --save mikros-cli

### Use command
$ npx mik start -i input.json -s
```


#### Error Solution
If you get error: "npm ERR! could not determine executable to run" when *$ npx mik ...* command is used do this:
```bash
$ rm -rf .git/hooks
$ npm install
```


## Commands
Initiate, delete, start, upload and download tasks from command line.

#### <span style="color:maroon">$ mik init &lt;taskName&gt;</span>
Use this command to start a new project (Mikros Task). It will create a taskName folder with initial files.
a) After init, move to created directory to continue using mikros commands: *$ cd taskName*
b) Open "manifest.json" file and modify title to taskName.

#### <span style="color:maroon">$ mik login</span>
Login to Mikros Web Panel with your username and password. After successfully logging in, a "conf.js" file is created. It contains a JWT Authentication Token and other sensitive data so please include it in .gitignore and NEVER push this file in the git repository.

#### <span style="color:maroon">$ mik logout</span>
Logout from Mikros Web Panel. It is highly recommended to logout every time development work is finished because it will delete the "conf.js" file.

#### <span style="color:maroon">$ mik delete &lt;taskName&gt;</span>
Delete a Mikros task. This command will delete the whole taskName folder. Curent working directory can be either in taskName or in its upper, parent directory.

#### <span style="color:maroon">$ mik start -i input.json -s</span>
When a task is created use this command to run a Mikros task locally. Echo messages will be printed in terminal.
```
Options:
-i --input  <inputFile.js>      select input file (initial data for Mikros task)
-s --short                      prints short messages
```

#### <span style="color:maroon">$ mik upload</span>
Upload the task on the Mikros serverless platform.
```
Alias:
$ mik u <taskName>

Options:
To use options position current working directory to folder above taskName.
-t --task  <taskName>      upload task by task name
-a --all                       upload all tasks
```

#### <span style="color:maroon">$ mik update</span>
Update task details without uploading the task files.
This command will read what is written in "manifest.json" and "howto.html" and update the task.
Althgough same can be done with "$mik upload" this is much faster because it will not change files.
The position have to be in the task's folder.


#### <span style="color:maroon">$ mik download &lt;task_id&gt;</span>
Download task files by task_id. Parameter task_id can be found in Web Panel / Tasks table.
This command will first delete all files in the folder and then create new, downloaded files.
Login is required before using this command e.g. "conf.js" file must be created.

```
Alias:
$ mik d
```



## Runtime Commands
MIKROS-CLI Runtime Commands are used to control Mikros task during runtime i.e. while NodeJS process is running. Once the task is started with **$ mik start -i input.json** it can be paused, resumed or stoped. Also it's very useful to test particular function without the need of starting the task from the beggining every time we want to test that function. This can save a lot of developer hours.

#### <span style="color:green">p</span>
Use this command to pause already started task.
Notice: This command will not pause currently running function. That function will be executed till the end and the next function will be paused. For example if we have ff.serial([f1, f2, f3]) and p command is executed during f2 runtime, then f2 will finish but f3 will not start.

#### <span style="color:green">r</span>
Resume the paused task. Usually it's used after command p when the paused task should be started again.

#### <span style="color:green">s</span>
Stop the running task. When this command is used the current function will be executed till the end and all next functions will not be executed.

#### <span style="color:green">k</span>
Kill the running NodeJS process and exit to the terminal command prompt. It's simmilar to CTRL+C.



#### <span style="color:green">i</span>
Show the input which is currently in use.
Usually shows the input used by CLI command *$mik start -i input.json* or reloaded by the runtime command input2.json

#### <span style="color:green">input.json</span>
When the command contains "input" and ".json" at the end it will reload the input file. For example *myInput5.json* will load new input data and the task will continue to work with that data.
It's useful when we want to see how different inputs will reflect to the function execution.

*Important: Add input into the lib parameter with ff.libAdd({input}); in your main.js file.*



#### <span style="color:green">x</span>
Show the "x" transitional variable. the x is the property of FunctionFlowX object.

#### <span style="color:green">x.field = &lt;value&gt;</span>
Add new or modify existing x field value.

#### <span style="color:green">x.field = &lt;value&gt;</span>
Add new or modify existing x field value.

#### <span style="color:green">delete x.field</span>
Delete the field property of x variable.

#### <span style="color:green">f</span>
Test the FunctionFlowX function code "ff_code" which has two parameters "x" and "lib" (x, lib) => { ...ff_code... }. Usually before using this command it's needed to pause the task with p.
Developers can use this command to make quick tests on the code inside FF function with the ability to use parameters "x" and "lib" which are usually inserted in the main.js file with:
```javascript
main.js
----------------
ff.setOpts({debug: false, msDelay: 5500});
ff.xInject(x);
ff.libInject(lib);
ff.libAdd({proxy, pupconfig, input});
```

#### <span style="color:green">f1 [,f2, ...]</span>
If the command doesn't correspond to any of the previous commands then it will search for the function file to execute it. For example if the command is login it will search for "login.js" and if exists it will execute it. Also it's possible to define multiple functions to be executed serially ff.serial[f1, f2, f3].
Usually before using this command it's needed to pause the task with p.



## Documentation
Documentation is available at [https://www.mikros.cloud/documentation/cli](https://www.mikros.cloud/documentation/cli) .


### Licence
The software is licensed under [AGPL-3.0](./LICENSE) .
