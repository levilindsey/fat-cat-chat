# fat-cat-chat: Server message syntax

The client parses all commands entered by the user and transforms some of them slightly. Additionally, there are numerous types of system messages that the user never needs to be aware of. This document gives a complete description of all actual commands recognized by the server.

#### Client-to-server messages

- `/join <user_name> <room_name>`
- `/nick <old_name> <new_name>`
- `/ping <from_user> <to_user>`
- `/leave <user_name> <room_name>`
- `/quit <user_name>`
- `/heartbeatrequest <user_name>`
- `/heartbeat <user_name> [<room_name>|/none]`

#### Bidirectional messages

- `/pubmsg <user_name> <room_name> (<message>)`
- `/msg <from_user> <to_user> (<message>)`

#### Server-to-client messages

- `/userleftroom <user_name> <room_name>`
- `/userjoinedroom <user_name> <room_name>`
- `/userleftserver <user_name>`
- `/userjoinedserver <user_name>`
- `/userchangedname <old_name> <new_name>`
- `/roomcreated <room_name>`
- `/roomdestroyed <room_name>`
- `/pong <from_user> <to_user> <time_in_millis>`
- `/heartbeatrequest <user_name>`
- `/heartbeat <to_user_name> (<room_name_1> ...) (<user_name_1> ...) [<room_of_user>|/none] (<user_in_room_1> ...)`
- `/error [<user_name>|/all] (<message>)`
