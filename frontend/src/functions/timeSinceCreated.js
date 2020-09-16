// return time since comment was posted
const timeSinceCreated = (time) =>
{
	time = Date.parse(time); 
	const timeNow = Date.now();
	const sinceCreated = (timeNow - time) / 1000;
	if (sinceCreated < 60)
		return "1 minute ago";
	if (sinceCreated < 3600)
		return Math.floor(sinceCreated / 60) + " minutes ago";
	if (sinceCreated < 7200)
		return "1 hour ago";
	if (sinceCreated < 86400)
		return Math.floor(sinceCreated / 3600) + " hours ago";
	if (sinceCreated < 172800)
		return "1 day ago";
	if (sinceCreated < 2592000)
		return Math.floor(sinceCreated / 86400) + " days ago";
	if (sinceCreated < 5184000)
		return " 1 month ago";
	if (sinceCreated < 31104000)
		return Math.floor(sinceCreated / 2592000) + " months ago";
	if (sinceCreated < 62208000)
		return " 1 year ago";
	else
		return Math.floor(sinceCreated / 31104000) + " years ago";
}
export default timeSinceCreated;