# Chute API

## Routes
Make all requests to `https://chute-backend.herokuapp.com/api`

### /files

`POST` - Used to upload a file. Expects `fileName` and `fileType` in the request body.

`GET` - Used to get a specific file. Expects `fileId` in the request body.

`DELETE` - Used to delete a specific file. Expects `fileId` in the request body.

### /signup

`POST` - Used to create a new user

Here's the post object
```
{
	"email" : "teddy@gmail.com",
	"password" : "password"
}
```

Here's the response:
```
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Y2U0NGI2OTY3ZWU3NDA4YWJlNTA2MTgiLCJpYXQiOjE1NTg0NjUzODUyNDd9._Uh1_KA-PQiKoBQuOCUpOvFVtSkyqVlTpuiN_qU2lZs"
}
```

### /signin

`POST` - Used to create a new user

Request:

```
{
	"email" : "teddy@gmail.com",
	"password" : "password"
}
```

Response:

```
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Y2U0NGI2OTY3ZWU3NDA4YWJlNTA2MTgiLCJpYXQiOjE1NTg0NjUzODUyNDd9._Uh1_KA-PQiKoBQuOCUpOvFVtSkyqVlTpuiN_qU2lZs"
}
```

### /all-files

`GET` - Get all files by user (This is a protected route that requires an `authorization` header.

Response:

```
[
    {
        "_id": "5ce45a40bd43c50b0fc7ff5c",
        "url": "https://chute-files.s3.amazonaws.com/testingtesing.pdf",
        "user": "5ce458e05a0c640b0071e126",
        "__v": 0
    },
    {
        "_id": "5ce45a43bd43c50b0fc7ff5d",
        "url": "https://chute-files.s3.amazonaws.com/testingtesing33333.pdf",
        "user": "5ce458e05a0c640b0071e126",
        "__v": 0
    }
]
```

### /download/:fileId

`GET` - Tells you if you have enough downloads remaining to download a file and decrements the downloads remaining

Response:
```
{
    "canDownload": false,
    "file": {
        "_id": "5ce6f7d9f7cdc7401be6aaee",
        "url": "https://chute-files.s3.amazonaws.com/HELLOOOO.pdf",
        "expirationDate": "2019-05-24T19:43:21.522Z",
        "downloadsRemaining": 6,
        "user": "5ce458e05a0c640b0071e126",
        "__v": 0
    }
}
```

## Setup

1. Clone the repo
2. `yarn`
3. Set up a `.env` file, an example for which is pinned in the Chute Slack channel.
4. `yarn start`

## Authors

<img src="https://imgur.com/rnoVEXT.jpg" alt="DJ (DhungJoo) Kim" width="200"/>
<p>DJ (DhungJoo) Kim</p>
<img src="https://imgur.com/Ft3zYd0.jpg" alt="Ben Eisner" width="200"/>
<p>Ben Eisner</p>
<img src="https://imgur.com/2Lz1TGE.jpg" alt="Justin Baltazar" width="200"/>
<p>Justin Baltazar</p>
<img src="https://imgur.com/O5SKy33.jpg" alt="Ricardo Taboada" width="200"/>
<p>Ricardo Taboada</p>
<img src="https://imgur.com/yPdFoc7.jpg" alt="Teddy Wahle" width="200"/>
<p>Teddy Wahle</p>


## Acknowledgments
Professor: Tim Tregubov
TA: Azhar Hussain
