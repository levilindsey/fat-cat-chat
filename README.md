# fat-cat-chat

#### An IRC-like chat server and web client application

### _THIS PROJECT IS CURRENTLY A WORK-IN-PROGRESS_

Some of the features of this chat server/client application include:

- A web client.
- Commands can be triggered both from typed commands and by clicking on appropriate graphical elements.
- Active, color-coded text for significant strings (e.g., commands, user names, room names).
    - Many of these color-coded strings can be clicked on for triggering some corresponding event (e.g., opening a private chat with a user by clicking on his/her name).
- Emoticons.
- Private chat.
- Dummy bots for helping to test and explore the functionality.
- Dynamic panels which can be expanded/collapsed by clicking on their headers.
- Encodes user-entered text for safe insertion into the HTML document.

### Client/server message protocol

- **`/help`**: Type `/help` to see a list of the available commands.
- **`/rooms`**: Type `/rooms` to see all of the current rooms.
- **`/join`**: Type `/join <room_name>` to join a new room. If the room did not previously exist, it will be created.
- **`/msg`**: Type `/msg <user_name> (<message>)` to send a private message to a user.
- **`/nick`**: Type `/nick <new_nickname>` to change your nickname.
- **`/ping`**: Type `/ping <user_name>` to get the lag time between you and another user.
- **`/ignore`**: Type `/ignore <user_name>` to ignore all messages from a user.
- **`/leave`**: Type `/leave` to leave the chat room. If you are the last user to leave the room, it will be removed.
- **`/quit`**: Type `/quit` to be removed from the chat server.
- **`/link`**: Type `/link <http[s]://somelink.com> (<message>)` anywhere within a message to indicate that the given message should be shown as a hyperlink pointing to the given URL.

All commands&mdash;except the `/link` command&mdash;must be given as the first text in the message.

Type anything not prefixed with `/` in order to send a normal message to everyone in the room.

Any word that starts with "http[s]://[...]" will be shown as an active hyperlink within the console.

### Technology stack

HTML5/CSS3/JavaScript, NodeJS, Express, Socket.IO, AWS Elastic Beanstalk, Jade.

### External libraries

- **he.js**
  - An HTML entity encoder/decoder written in JavaScript.
  - https://github.com/mathiasbynens/he

======

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=levisl176&url=github.com/levisl176/fat-cat-chat&title=fat-cat-chat&language=javascript&tags=github&category=software)
