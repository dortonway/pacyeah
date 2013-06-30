pacyeah
=======

If you want to play without statistics, just run the pacyeah.html file.
Else install Node.js, MongoDB then run the following commands in MongoDB shell:

> use pacyeah

> db.rating.ensureIndex({name: 1}, {unique: true})

=======
TO-DO List:
- give points for each kill
- make dynamic walls (after an each hit a smooth moving to an opposite side with a slowdown)
