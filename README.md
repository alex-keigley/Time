
## To-do
- Categories/Specialties
- Force swipe commpand
- Way for user to see time in current time period
- Update hard-coded values to be stored in guildsettings model
- guildsettings - manage clock roll for admin perms

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
