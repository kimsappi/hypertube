# Registration/login
POST /api/auth/register
{
  username: etc
}

POST /api/auth/login
{
  username: etc
}

POST /api/auth/42api
{token: $token}

POST /api/auth/googleapi
{token: $token}

# User profiles
GET /api/users/:id
Get profile of user id
{
  username: etc
}

GET /api/users/me
Get your current profile data

POST /api/users/me
Edit your current profile data

# Movie routes
GET /api/movie/:id
Get movie page

GET /api/cinema/:id
Get video stream of movie

POST /api/movie/new
{magnet: $magnetLink}
Initiate download of a movie

# Comment routes
GET /api/comments/:id
Get comments of movie

POST /api/comments/
{message: $message}
Post new comment

PUT /api/comments/:id
{message: $message}
Edit existing comment

DELETE /api/comments/:id
Delete comment