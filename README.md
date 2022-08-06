
## To-do

# Ideas
- Could use event listeners and timestamps to enable automation of things like closing time period.
- Make help commands not hard-coded

## Current Commands
### Open Access
- None

### General User Role Access
- /clocked-in - Returns list with times of everyone clocked in
- /lifetime - Returns all hours ever tracked for user
- /swipe - Used to clock in and out
- /data - Return hours clocked since start of time period
- /list-specialities - Return all specialities available to clock-in to
- /help - Lists all general use commands

### Administrator
#### Setup
- /set-clockchannel - Set which channel to use for clocking in/out
- /set-clockinrole - Set which role to add while clocked in
- /set-userrole - Set which role has general access to clock in/out
- /set-manageclockrole - Set role which will have admin level access to bot - Only usable by discord admin
- /set-expectedtime - Set time in minutes that members are supposed to clock in a time period.
- /set-defaultspecialty - Sets specialtiy to clock-in to if there is no input
- /add-specialty - Add specialty to guild settings list
- /remove-specialty - Remove specialty from guild settingsl list
#### Standard
- /force-swipe - Force clock a user in or out
- /time-period - Totals milliseconds for each member with data between two given dates and generates CSV.
- /adjust - Add or remove time from a member
- /close-timeperiod - Close the current time period and generate csv.
- /help-admin - List all admin commands