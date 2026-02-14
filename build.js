import meta from './meta.js'

const SAY = (...args) => console.log(...args)

import * as cheerio from 'cheerio'
import fs from 'fs'

const SITE = 'https://heresybeats.bandcamp.com'

const embed = (item) => `
	<iframe 
		style="border: 0; width: 420px; height: 660px;" 
		src="${item.embedUrl}" 
		seamless>
		${item.artist} - ${item.title} (released ${item.date})
	</iframe>`
const template = (item) => {
	const isoDate = new Date(item.date).toISOString().split('T')[0]
	
	return `
	<article class="release" itemscope itemtype="https://schema.org/MusicRelease">
		<header>
			
			<h2 itemprop="name">
				<a href="${item.url}" title="[${item.labelId}] ${item.artistName} - ${item.titleName}">
					<span itemprop="byArtist" itemscope itemtype="https://schema.org/MusicGroup">
						<span itemprop="name" class="artist">${item.artistName}</span>
					</span>
					<span class="title">${item.titleName}</span>
				</a>
			</h2>

			<div class="meta">
				<span class="id" itemprop="identifier">${item.labelId}</span>
				<span class="sep">/</span>
				<time class="date" itemprop="datePublished" datetime="${isoDate}" >${item.date}</time>
			</div>
		</header>

		<div class="player" itemprop="workExample" itemscope itemtype="https://schema.org/AudioObject">
			${embed(item)}
		</div>

		<footer>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
			  	<circle cx="50" cy="50" r="50" fill="#CCCCCC" />
			</svg>
		</footer>
	</article>`
}
const run = async () => {

	SAY(meta)

	let outputHtml = fs.readFileSync('./template.html', { encoding: 'utf8' })

	for (const [id,value] of Object.entries(meta)) {
		outputHtml = outputHtml.replaceAll(`"$${id}"`, JSON.stringify(value))
		outputHtml = outputHtml.replaceAll(`$${id}`, value)
	}

	SAY(outputHtml)

	const res = await fetch(`${SITE}/music`)
	const html = await res.text()
	const $ = cheerio.load(html)

	const links = $('.music-grid-item a').map((_, el) => $(el).attr('href')).get()

	const data = await Promise.all(links.map(async (path) => {
		const url = path.startsWith('http') ? path : `${SITE}${path}`
		const itemRes = await fetch(url)
		const itemHtml = await itemRes.text()
		const $$ = cheerio.load(itemHtml)

		const albumData = JSON.parse($$('script[data-tralbum]').attr('data-tralbum') || '{}')
		
		const title = $$('.trackTitle').first().text().trim()
		const [labelId, artistName, titleName] = title.split('-').map(bit => bit.trim())
		const image = $$('#tralbumArt img').attr('src')
		const artist = albumData.artist
		const titleId = albumData.id
		const date = (new Date(albumData.current.release_date)).toUTCString().substring(5,17)

		return {
			artist,
			artistName,
			title,
			titleName,
			titleId,
			labelId,
			image,
			url,
			date,
			embedUrl: `https://bandcamp.com/EmbeddedPlayer/album=${titleId}/size=large/bgcol=ffffff/linkcol=333333/tracklist=true/transparent=true/`
		}
	}))

	let contentHtml = ''
	for (const item of data) contentHtml += template(item)

	outputHtml = outputHtml.replace('$websiteContent', contentHtml)


	fs.writeFileSync('docs/index.html', outputHtml, 'utf8')
	// SAY('HTML OUTPUT:', outputHtml)
}

run()