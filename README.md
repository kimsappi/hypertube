# Features/requirements

## Tech
- [ ] Firefox and Chrome compatibility
- [ ] Layout: header, body, footer
- [ ] Mobile-friendly layout
- [ ] **No errors, warnings or logs**

## Security
- [ ] Password encryption
- [ ] XSS prevention
- [ ] Form data must be validated
- [ ] Disallow uploading unwanted content
- [ ] SQL injection prevention

## User
- [ ] Registration with email, username, first & last names, password (reasonably complex)
- [ ] Authentication must be possible via 42 API and another Oauth API
- [ ] 'Forgot password' feature (email)
- [ ] Ability to log out in 1 click from any page
- [ ] Ability so choose a preferred language (English by default)
- [ ] Modify email address, **profile picture** and other info
- [ ] Browse the profiles of other users (email must not be shown)

## Search
- [ ] Search must be conducted on 2 torrent listing sites
- [ ] Search must be limited to videos
- [ ] Must be able to suggest the most popular videos from the sources before a search query is performed (criteria can be downloads, peers, seeders...)
- [ ] Thumbnails of videos must be shown
- [ ] Results must be sorted by name
- [ ] Thumbnail must include production year, IMDb 'note' (score?) (Try to make sense of this: 'In addition to the name of the video, a thumbnail must be composed, if available, of its production year, its IMDb note and a cover image.)')
- [ ] Previously watched videos must be labeled
- [ ] Results must be paginated, pagination must be through AJAX (infinite scroll / buttons possibly allowed?)
- [ ] Results must be sortable and filterable by name, genre, IMDb score, production year, ...

## Video
- [ ] Display summary, main cast (producer, director, stars), year, length, IMDb score, 'cover story'(????)
- [ ] Videos must be commentable
- [ ] If file does not exist on the server, download must be initiated
- [ ] Streaming must start when download is far enough that user won't need to buffer
- [ ] Videos not watched in the last month must be deleted
- [ ] English subtitles must be downloaded if available
- [ ] If movie is not in user's preferred language, subtitles will need to be downloaded
- [ ] If video is not `mp4` or `webm`, it must be converted on the server (at least `mkv` support is *required*)
