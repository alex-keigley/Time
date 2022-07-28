
## To-do
- Create better time-period command
- Formatting
- Standardize command format
- Refactor /close-timeperiod
- Continue refactoring starting from lifetime.js

# Ideas
- Could use event listeners and timestamps to enable automation of things like closing time period.

## Current Commands
#### Open Access
- /clocked-in - Returns list with times of everyone clocked in
- /lifetime - Returns all hours ever tracked for user
- /swipe - Used to clock in and out
- /data - Return hours clocked since start of time period

#### Administrator
- /force-swipe - Force clock a user in or out
- /setclockchannel - Set which channel to use for clocking in/out
- /setclockinrole - Set which role to add while clocked in
- /setmanageclockrole - Set role which will have admin level access to bot - Only usable by discord admin
- /raw-time - Totals milliseconds for each member with data between two given dates and generates CSV. Does not account for specialties or adjustments.
- /add-specialty - Add specialty to guild settings list
- /remove-specialty - Remove specialty from guild settingsl list
- /set-defaultspecialty - Sets specialtiy to clock-in to if there is no input
- /adjust - Add or remove time from a member
- /close-timeperiod - Close the current time period and generate csv.

#### Developer
- /echo
- /ping