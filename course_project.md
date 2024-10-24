# Description
The project is a modular automation system, where automated module can be added in Plug'n'Play fashion.

The project should be capable of growing both in supported modules and in complexity.

A module is single and simple IoT device capble of a limited set of actions. The solution should support the addition of new modules regarding of current phase of the project.

A growth in complexity should enhance overall experience of the solution, and shall be implemented in phases. Additionally the project growth shouldn't disrupt the user experience (except the first three versions, which are considered alpha).

As long as there's no financial parterner, the project is considered for personal and education purposes only.

# Project Phases:
1. MVP Phase:
    - No mobile application will be developed
    - No backend will be developed
    - The node will act on it's own
    - The node will recieve commands from a telegram bot
    - Each user will have only one telegram bot
        - to ease the management of multiple nodes (no more than one bot per user)
        - to isolate and maintain security of each user (no more than one user per bot)
    - A user can send one command for one node per message
    - Any node can recieve all commands, but will act upon commands designated to it
2. Mobile Application Phase:
    - Node-MobileApp communication will still be using telegram API
    - The user will be provided with "built-in" widgets to control nodes
3. Dedicated Backend Phase:
    - Node-MobileApp communication will pass through the server
        - Nodes should get the last flash
    - Node OTA updates should be implemented
        - No further disruption is allowed
    - Mobile application should query registered nodes for a given user
    - Mobile application should dynamically create suitable widget for each node
        - Widget layout will be specified by the server
    - The server should be exposed through a proper domain name
        - To avoid any disruption caused by an IP address change
4. Dynamic Nodes Addition Phase
    - All new nodes should be manufacutered with a QR-code embedded ID
    - Addition of new devices by the user require QR code scanning through the mobile application
5. Complex WorkFlow Phase
    - User can schedule actions a head of time
    - User can view the history of issued commands, and their relevant state
    - Virtual Nodes can be added by the user to enhance the usability of a given node
        - A virtual node can communicate and control other nodes
        - Examples include
            - weather node, get weather data from online services
            - aggregation node, broadcast recieved command into multiple other nodes, and aggregates the response
    - User can specify conditions for a node actuation
        - the condition can include the state of other nodes
6. Mobile Application UI Overhaul
    - Provide the user with a dashboard like UX

# User Stories
1. User opens the hydration valve for a given time
    - Acceptance criteria:
        1. Actuation of the valve within 5 minutes (assuming the user and node are internet connected)
        2. The valve is actuated for the required period by the user (~1 minute difference is acceptable)
        3. The valve is closed for error or malfunction that has occured in the system (regardless of type or source of error)
2. User inspects the current water level in the tanks
3. User activates the well water pump
4. User sets a watering and pumping schedule (complex story)
    - Acceptance criteria:
        1. Well pump is activated whenever the tanks reach a critical level, and the solar system is ready
        2. If the tank level is anticipated to reach critical level under unsuitable conditions, the well pump should be activated
            - unsuitable conditions are those that prevent the well pump from being active, like clouds and nights for solar systems, and offline schedules for state provided electricity
        3. The well pump is stopped if critial conditions are reached
        4. The user is capable of setting up the schedule easily (no technical knowledge about the system should be required)
5. User wants to inspect humidity level in soil
    - Acceptance criteria:
        1. The humidity measuring module should last long enough (hobbyist-level sensor degrade in few days)
        2. The measurement accuracy should be accurate enought to allow the user or an automated schedule to water the operate the hydration valves adequatly
            - adequatly means the valves are not opened when the plants are hydrated (wasting water)
            - and valves are not closed when plants are thirsty (endangering the plants)
