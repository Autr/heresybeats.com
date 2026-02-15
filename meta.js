const labelGenres = 'techno, dnb, jungle, footwork, house, leftfield'
const labelName = 'Heresy'
const labelDesc = `Forward-thinking artists and their music, London UK`
const labelTags = 'record label, independent artists, london, uk'
const labelEmail = 'hello@heresybeats.com'
const labelLinks = 'https://heresybeats.bandcamp.com https://soundcloud.com/heresybeats'

const config = {

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
	websiteYear: (new Date()).getFullYear(),
	websiteFooterLinks: '<ul>' + [ labelEmail, ...labelLinks.split(' ') ].map( link => {

		link = link.trim()
		if (link.includes('@')) {
			return `<li><address aria-label="email"><a href="mailto:${link}">${link}</a></address></li>`
		} else {

			const name = link.split('/').filter(bit => {
				return bit != '' && bit != 'http:' && bit != 'https:' && bit != 'www'
			}).join('/')

			console.log('NAME', name)
			return `<li><a itemprop="sameAs" aria-label="${name}" href="${link}">${name}</a></li>`
		}
	}).join('\n') + '</ul>',
	websiteDateString: String(Number(new Date))

}

export default config