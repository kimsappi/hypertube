const genresInRandomOrder = () =>
{
	let array = ["Action", "Animation", "Adventure", "Biography", "Comedy",
	"Crime", "Documentary", "Drama", "Family", "Fantasy",
	"History", "Horror", "Music", "Musical", "Mystery", "Romance",
	"Sci-Fi", "Sport", "Thriller",
	"War", "Western"];

	for (let i = array.length - 1; i > 0; i--)
	{
		const j = Math.floor(Math.random() * i)
		const temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return array;
}
export default genresInRandomOrder;