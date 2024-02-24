# DEX8 CLI
> DEX8 CLI is a command line interface which helps developers to create and execute DEX8 Skripts (automated serverless scripts).


## Core Api
The DEX8 Api is used for login, upload skript, download skript and update the skript on the DEX8 Serverless Platform.

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
Initiate, delete, start, upload and download skripts from command line.


#### $ dex8 --version
Get the dex8-cli version
```
Alias:
$ dex8 -v
```


#### $ dex8 login
Login with [DEX8 Web Panel](https:panel.dex8.com) username and password. Upon successful login, a "dex8auth.json" file is generated, housing a JWT Authentication Token and other sensitive information. Ensure its inclusion in .gitignore to prevent accidental commits to the Git repository. Never push this file to the repository !


#### $ dex8 logout
It is strongly advised to log out upon completing development skripts, as doing so will remove the "dex8auth.json" file.


#### $ dex8 init
Initiate a new project (DEX8 Skript) with this command.
Upon answering a series of questions, it will generate a folder containing the initial files.
```
Alias:
$ dex8 i
```

#### $ dex8 delete &lt;skriptTitle&gt;
Remove a DEX8 skript with this command. It will delete the entire folder named with skriptTitle argument. The command position can be either within skriptTitle or its parent directory.


#### $ dex8 bundle
Bundle main.js and save it in the ./dist/mainBundle.js.
```
Alias:
$ dex8 b
```

#### $ dex8 bundleRemove
Remove the /dist/ directory.
```
Alias:
$ dex8 brm
```


#### $ dex8 start -i input.json -is inputSecret.js
Once a skript is created, utilize this command to start a DEX8 Skript. The inputSecret.json will holds passwords and other confidential information.
```
Options:
-i --input  <input.json>      select input file (initial data for DEX8 skript)
-is --inputSecret  <inputSecret.js>     input file with secret data
-b --bundle       execute dist/mainBundle.js instead of main.js
```
```
Alias:
$ dex8 s
```


#### $ dex8 upload
Upload the skript to the DEX8 SaaS Platform. Prior to uploading, bundle the main.js file using the **$ dex8 bundle** command.
```
Alias:
$ dex8 u

Options:
To use options position current working directory to folder above skriptTitle.
-s --skript  <skriptTitle>      upload skript by skript title
-a --all                       upload all skripts

Examples:
$ dex8 upload                    -> if we are in the skript folder
$ dex8 upload -t <skriptTitle>     -> if we are in the skript parent folder
$ dex8 upload --all              -> if we are in the skript parent folder
```


#### $ dex8 update
Update skript details without uploading the skript files. This command will retrieve information from "manifest.json" to update the skript. While the same can be achieved with **$ dex8 upload**, this method is faster as it doesn't modify any skript files. Ensure the current position is within the skript's folder.


#### $ dex8 download &lt;skript_id&gt;
Download skript files using the skript_id parameter, which can be located in the Web Panel's Skripts table. This command will initially clear the folder of all files and then replace them with the newly downloaded ones. Prior to utilizing this command, login is necessary, and the "dex8-auth.json" file must be created.

```
Alias:
$ dex8 d
```


## Documentation
The documentation is available at [https://www.dex8.com/docs](https://www.dex8.com/docs) .


### Licence
The software is licensed under [AGPL-3.0](./LICENSE) .
