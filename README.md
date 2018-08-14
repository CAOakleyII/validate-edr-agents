## Getting Started

```
# clone this repo
git clone 
# navigate into the directory
cd validate-edr-agents

# install dependencies (note: node v10.8.0 used)
npm i
# run the app
npm start
# run tests
npm run test
```

### Overview


### Technical Decisions

I decided to use NodeJs because along with matching the software constraints of Linux, MacOS and Wnidows, it handles non-blocking I/O very well and in a clean manner. This allows the ability to test multiple agents and activities efficiently with easy to maintain code.

Following the open-closed principle within S.O.L.I.D design, I decided to use a registry to maintain which activities we trigger from the EDR Agent.

I use the native http request object provided by nodejs, over implementations such as fetch because it allows me to gather metadata regarding the client/remote connection.

Due to the size and scope of the project, I decided not to map the edr_agents file to defined models, currently the models are purely data, and do not have any instanced functions requiring models or storing to a database. 

I also decided to use HTTP for my network transaction. However the `HttpService` could be updated to use the same pre-existing pattern for services, and make other network calls based on the activity. e.g. Raw TCP/UDP connections, Messaging Services, etc.


### To-Dos / Improvements

Unit test negative cases, where an EDR does make a change that is breaking 

Improve test coverage 