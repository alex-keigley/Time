
## To-do
- Categories/Specialties
- Way for user to see time in current time period
- Add default specialty in guildsettings

## Current Commands
#### Open Access
- /clocked-in - Returns list with times of everyone clocked in
- /lifetime - Returns all hours ever tracked for user
- /swipe - Used to clock in and out

#### Administrator
- /force-swipe - Force clock a user in or out
- /setclockchannel - Set which channel to use for clocking in/out
- /setclockinrole - Set which role to add while clocked in
- /setmanageclockrole - Set role which will have admin level access to bot - Only usable by discord admin
- /time-period - Totals time for each member with data between two given dates and generates CSV
- /add-specialty - Add specialty to guild settings list
- /remove-specialty - Remove specialty from guild settingsl list

#### Developer
- /echo
- /ping

## DBD
https://app.quickdatabasediagrams.com/#/


```
Members
-
ds_id varchar pk FK >- Shifts.ds_id
guild_id varchar FK >- Guild_Settings.guild_id
ds_name varchar
ds_discriminator int
ds_nick varchar
current_shift varchar FK >- Shifts.shift_id

Shifts
-
shift_id serial pk
ds_id varchar
spec_id
start-time time
end-time time
total-length time

Specialties
-
spec_id serial pk FK >- Shifts.spec_id
speciality varchar

Guild_Settings
-
guild_id varchar pk
clock_channel_id varchar
```
