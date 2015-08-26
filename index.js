var request = require( 'request' );
var cheerio = require( 'cheerio' );
var fs = require( 'fs' );
var ProgressBar = require( 'progress' );
var sanitize = require( 'sanitize-filename' );
var colors = require( 'colors' );
var ask = require( 'prompt-autocomplete' );
var validUrl = require( 'valid-url' );

function buildShowUrl( id, page ) {
	return 'http://www.radio1.rai.it/dl/portaleRadio/programmi/json/liste/' + id + '-json-A-' + ( page ? page : 0 ) + '.html';
}

function createFolder( dir ) {
	dir = sanitize( dir.trim() );
	if ( !fs.existsSync( './downloaded/'+dir ) ) {
		fs.mkdirSync( './downloaded/'+dir );
	}
	return dir;
}

function download( url, folder, name, callback ) {
	name = name || 'self-titled';
	request( url, function( err, req ) {
		var body = req.body;
		var audioUrl = body.match( /var audioUrl = \"(.*)\";/gi ) && body.match( /var audioUrl = \"(.*)\";/gi )[0].replace( 'var audioUrl = "', '' ).replace( '\";', '' );
		if ( audioUrl ) {
			console.log( ( '\nDOWNLOADING: ' + folder + ' - ' + name ).bold + ( ' -> ' + url ).grey );
			var downloaded = fs.readFileSync( './downloaded.txt', 'UTF8' );
			var bar;

			if ( downloaded.indexOf( './downloaded/'+folder+'/'+sanitize( name ) )===-1 ) {
				request({
					url: audioUrl,
					encoding: null
				}, function( err, res ) {
					if ( err || !res.headers['content-type'] ) {
						console.log( ( err || 'SOMETHING WENT WRONG' ).red );
						failed.push( folder + ' - ' + name + ' -> ' + url );
						callback();
					}else {
						var est = '.mp3';

						if ( res.headers['content-type'].indexOf( 'realaudio' )>-1 ) {
							est = '.ram';
							console.log( 'WARNING: this is a realaudio streaming file'.yellow );
						}

						console.log( 'DONE'.green );
						fs.writeFileSync( './downloaded/'+folder+'/'+sanitize( name )+est, res.body );
						fs.appendFileSync( './downloaded.txt', './downloaded/'+folder+'/'+sanitize( name )+'\n' );
						callback();
					}
				}).on( 'response', function( res ) {
					bar = new ProgressBar( '[:bar] :percent :etas'.bold, {
						complete: '=',
						incomplete: ' ',
						width: 60,
						total: parseInt( res.headers['content-length'], 10 )
					});
				})
				.on( 'data', function( chunk ) {
					if ( bar ) {
						bar.tick( chunk.length );
					}
				});
			} else {
				console.log( 'ALREADY DOWNLOADED'.green );
				callback();
			}
		} else {
			console.log( ( 'URL MISSING ' ).red + ( folder + ' - ' + name ).red.bold + ( '-> ' + url ).red + '\n' );
			callback();
		}
	});
}

function parseEpisodes( episode, episodes, callback ) {
	var splitted = episode.split( ' - ' );

	var folder = createFolder( splitted[0] );
	download( splitted[splitted.length-1], folder, splitted.slice( 1, -1 ).join( ' - ' ), function() {
		if ( episodes.length ) {
			parseEpisodes( episodes.shift(), episodes, callback );
		} else {
			callback();
		}
	});
}

function openBookPage( body, callback ) {
	var links = body.list.filter(function( item ) {
		return item.hasAudio!=='false';
	}).map(function( item ) {
		return item.name  + ' - ' + item.weblink;
	});

	parseEpisodes( links.shift(), links, callback );
}

function fetchShowPage( elm, page, queue, callback ) {
	var id = elm.attribs.id;
	request( buildShowUrl( id, page ), function( err, req ) {
		var body = JSON.parse( req.body );
		openBookPage( body, function() {
			if ( parseInt( body.pages ) !== parseInt( body.currPage )+1 ) {
				fetchShowPage( elm, page+1, queue, callback );
			} else if ( queue.length ) {
				fetchShowPage( queue.shift(), 0, queue, callback );
			} else {
				callback();
			}
		});
	});
}

function askWhatToDownload( url ) {
	if ( !validUrl.isUri( url ) || url.indexOf( '.rai.it/dl/portaleRadio/Programmi/' )===-1 ) {
		console.log( 'ERROR: you need to enter a valid Rai Radio 3 program url to be parsed'.red );
		return;
	}
	request( url, function( err, req ) {
		var $ = cheerio.load( req.body );
		var audioLinks = $( 'li.Audio a[target=top]' ).toArray();
		audioLinks.sort(function( a, b ) {
			return $( a ).text().localeCompare( $( b ).text() );
		});

		var links = audioLinks.map(function( item ) {
			return $( item ).text();
		});

		links.unshift( 'All of them' );

		ask( 'What to download?', links, {
			maxAutocomplete: process.stdout.rows - 2
		}, function( err, show ) {
			var toDownload = links.indexOf( show );
			if ( !toDownload ) {
				toDownload = audioLinks;
			} else {
				toDownload = [ audioLinks[toDownload-1] ];
			}
			fetchShowPage( toDownload.shift(), 0, toDownload, function() {
				if ( failed.length ) {
					console.log( '\nFAILED:\n'.red + failed.join( '\n' ) );
				}
				console.log( '\nDONE'.green.bold );
			});
		});

	});
}

var failed = [];

if ( !fs.existsSync( './downloaded.txt' ) ) {
	fs.writeFileSync( 'downloaded.txt', '' );
}

if ( !fs.existsSync( './downloaded' ) ) {
	fs.mkdirSync( './downloaded' );
}

askWhatToDownload( process.argv[2] );
