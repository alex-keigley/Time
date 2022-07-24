https://www.youtube.com/watch?v=RbVXxVReCNc

Following this series, pick back up on start of part 4


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
