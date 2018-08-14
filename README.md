## Getting Started

```bash
# clone this repo
git clone https://github.com/CAOakleyII/validate-edr-agents.git
# navigate into the directory
cd validate-edr-agents

# install dependencies (note: node v10.8.0 used)
npm i
# run the app
npm start
# run tests
npm run test
```

## Overview
This application tests against "mock" EDR agents data.

In order to verify the deletion and modification of files, this application creates them on initialization.

#### File System
On Windows/Linux machine files will be created, modified and deleted at ~/EDR_Test.
  - Created : Text file containing "Hello World" at ~/EDR_Test/created.txt
  - Modified : Text file containing "How are you, Universe?" at ~/EDR_Test/modify-me.txt
  - Deleted : Text file containing "You should not see this." should be removed at ~/EDR_Test/to-be-deleted.txt

#### Process 
On Windows machines, notepad.exe will be executed with the parameter of C:\windows\system32\drivers\etc\hosts displaying your host file.

On Linux machines, /bin/ps will be exeecuted with no parameters.

#### Network
On Windows/Linux machines an HTTPS POST will be made to a demo api endpoint at jsonplaceholder.typicode.com, sending a mock blog post.

A JSON log file will contain a record for each of these activities, along with meta data that presists through multiple runtimes. This will be found at /dist/logs/activity-log.json

The activity "instructions" for an agent are located within edr_agents_template.json, this "emitted" EDR data is mock only, and would likely look and be parsed differently in a real world scenario.

The entry point is app.js, which loops through the activities and invokes a service function that processes each activity and logs them.

## Technical Decisions

I decided to use NodeJs because along with matching the software constraints of Linux, MacOS and Windows, it handles non-blocking I/O very well and in a clean manner. This allows the ability to test multiple agents and required activities efficiently with easy to maintain code.

Following the open-closed principle within S.O.L.I.D design, I decided to use a registry to maintain which activities we trigger from the EDR Agent.

I use the native http request object provided by nodejs, over implementations such as fetch because it allows me to gather metadata regarding the client/remote connection.

Due to the size and scope of the project, I decided not to map the edr_agents file to defined models, currently the models are purely data, and do not have any instanced functions requiring models or storing to a database. 

I also decided to use HTTP for my network transaction. However the `HttpService` could be updated to use the same pre-existing pattern for services, and make other network calls based on the activity. e.g. Raw TCP/UDP connections, Messaging Services, etc.

## To-Dos / Improvements
Improve test coverage 