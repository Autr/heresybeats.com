const labelGenres = 'techno, dnb, jungle, footwork, house, leftfield'
const labelName = 'Heresy'
const labelDesc = `Forward-thinking artists and their music, London UK`
const labelTags = 'record label, independent artists, london, uk'
const labelEmail = 'hello@heresybeats.com'
const labelLinks = 'http://heresybeats.bandcamp.com https://soundcloud.com/heresybeats'

export default {

	websiteTitle: labelName,
	websiteDesc: labelDesc,
	websiteEmail: labelEmail,
	websiteKeywords: [
		...labelTags.split(',').map(tag => tag.trim()),
		...labelGenres.split(',').map(genre => genre.trim()),
		labelName.toLowerCase()
	],
	websiteLinks: labelLinks.split(' ').map(link => link.trim()),
	websiteGenres: labelGenres.split(',').map(link => link.trim()),
	websiteYear: (new Date()).getFullYear()

}