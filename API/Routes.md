# Routes
All functionnal routes will be listed here
<details>

<summary>Teams</summary>

### @route {GET}    /team/list

- @param
- @response         array of teams

### @route {GET}    /team/

- @param            id
- @response         team

### @route {POST}   /team/create
**REQUIRES AUTH**
- @bodyparams       name: string(64), description: string(255)
- @response         team

### @route {PUT}    /team/update
**REQUIRES AUTH**

- @bodyparams       id: unsigned int, name: string(64), description: string(255)
- @response         team

### @route {DELETE} /team/delete
**REQUIRES AUTH**

- @bodyparams       id: unsigned int
- @response

### @route {POST}   /team/register
**REQUIRES AUTH**

- @bodyparams       team: unsigned int, tournament: unsigned int
- @response

</details>

<details>

<summary>Tournaments</summary>

### @route {GET}    /tournament/list

- @param
- @response         array of tournaments

### @route {GET}    /tournament/

- @param            id
- @response         tournament

### @route {POST}   /tournament/create
**REQUIRES AUTH**
- @bodyparams       name: string(64), description: string(255)
- @response         tournament

### @route {PUT}    /tournament/update
**REQUIRES AUTH**

- @bodyparams       id: unsigned int, name: string(64), description: string(255)
- @response         tournament

### @route {DELETE} /tournament/delete
**REQUIRES AUTH**

- @bodyparams       id: unsigned int
- @response

</details>

<details>

<summary>Users</summary>


### @route {POST}  /user/register
**REQUIRES AUTH**
- @bodyparams      username: string(64), password: string(72)
- @response        jwt token

### @route {PUT}   /user/update
**REQUIRES AUTH**

- @bodyparams      old_password: string(72), new_username: string(64), new_password: string(72)
- @response        jwt token


### @route {POST}  /user/auth
**REQUIRES AUTH**

- @bodyparams      username: string(64), password: string(72)
- @response        jwt token

</details>

<details>

<summary>Matches</summary>

### @route {GET}    /match/list/

- @param            id(tournament)
- @response         array of matches

### @route {GET}    /match/

- @param            id
- @response         match

### @route {POST}   /match/create
**REQUIRES AUTH**
- @bodyparams       id(tournament)
- @response         

### @route {PUT}    /match/score
**REQUIRES AUTH**

- @bodyparams       id(match), score: string(20) matching regex /^-?\d+\/-?\d+$/ (two ints separated by a /)
- @response         

### @route {DELETE} /match/delete
**REQUIRES AUTH**

- @bodyparams       id(match)
- @response

</details>