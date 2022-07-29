
## To-do

# Ideas
- Could use event listeners and timestamps to enable automation of things like closing time period.

## Current Commands
### Open Access
- /clocked-in - Returns list with times of everyone clocked in
- /lifetime - Returns all hours ever tracked for user
- /swipe - Used to clock in and out
- /data - Return hours clocked since start of time period

### Administrator
#### Setup
- /set-clockchannel - Set which channel to use for clocking in/out
- /set-clockinrole - Set which role to add while clocked in
- /set-manageclockrole - Set role which will have admin level access to bot - Only usable by discord admin
- /set-defaultspecialty - Sets specialtiy to clock-in to if there is no input
- /add-specialty - Add specialty to guild settings list
- /remove-specialty - Remove specialty from guild settingsl list
#### Standard
- /force-swipe - Force clock a user in or out
- /time-period - Totals milliseconds for each member with data between two given dates and generates CSV.
- /adjust - Add or remove time from a member
- /close-timeperiod - Close the current time period and generate csv.