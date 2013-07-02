pacyeah ([play](http://92.241.103.23/pacyeah/pacyeah.html))
=======

If you want to play without statistics, just run the pacyeah.html file.
Else install Node.js, MongoDB, then run the following commands in MongoDB shell:

> use pacyeah

> db.rating.ensureIndex({name: 1}, {unique: true})

=======
TO-DO List:
- add sounds and music
- make dynamic walls (after an each hit a smooth moving to an opposite side with a slowdown)