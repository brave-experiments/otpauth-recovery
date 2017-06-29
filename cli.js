#!/usr/bin/env node

const fs = require('fs')
const querystring = require('querystring')
const url = require('url')

const qr = require('qr-image')
const underscore = require('underscore')

// courtesy of https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout#33292942
const timeout = (msec) => { return new Promise((resolve) => { setTimeout(resolve, msec) }) }

const worker = (filename) => {
  fs.readFile(filename, { encoding: 'utf8', flag: 'r' }, async (err, data) => {
    if (err) throw err

    const entries = JSON.parse(data)
    if (!Array.isArray(entries)) throw new Error('not an array: ' + process.argv[2])

    var tasks = 0

    entries.forEach(async (entry) => {
      const parts = url.parse(entry.url, true)
      const label = querystring.unescape(parts.pathname ? parts.pathname.split('/')[1] : '')

      var chunks = []
      var x = label.indexOf(':')

// courtesy of
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#A_stricter_parse_function
      const filterInt = (value) => {
        return ((/^(-|\+)?([0-9]+|Infinity)$/.test(value)) ? Number(value) : NaN)
      }

      const pairs =
        [
          [ parts.protocol !== 'otpauth:', 'invalid protocol' ],
          [ [ 'hotp', 'totp' ].indexOf(parts.host) === -1, 'invalid type' ],
          [ label === '', 'invalid label' ],
          [ !parts.query.secret, 'missing secret parameter' ],
          [ [ undefined, 'SHA1', 'SHA256', 'SHA256' ].indexOf(parts.query.algorithm) === -1, 'invalid algorithm parameter' ],
          [ [ undefined, '6', '8' ].indexOf(parts.query.digits) === -1, 'invalid digits parameter' ],
          [ (parts.host === 'hotp') && (parts.counter) && isNaN(filterInt(parts.counter)), 'invalid counter parameter' ],
          [ (parts.host === 'totp') && (parts.period) && isNaN(filterInt(parts.period)), 'invalid period parameter' ],
          [ !underscore.isEmpty(
            underscore.omit(parts.query,
                            [ 'secret', 'issuer', 'algorithm', 'digits', parts.host === 'hotp' ? 'counter' : 'period' ])),
            'invalid parameters' ]
        ]

      pairs.forEach((pair) => {
        if (pair[0]) throw new Error(pair[1] + ': ' + parts.protocol + parts.host + '/' + parts.pathname)
      })

      if (x !== -1) {
        entry.accountName = label.substring(x + 1)
        entry.issuer = label.substring(0, x).trim()
      } else {
        entry.accountName = label
        entry.issuer = parts.query.issuer
      }
      entry.accountName = entry.accountName.trim()
      entry.issuer = entry.issuer && entry.issuer.trim()

      tasks++
      qr.image(entry.url, { type: 'png' }).on('data', (chunk) => { chunks.push(chunk) }).on('end', () => {
        entry.dataURL = 'data:image/png;base64,' + Buffer.concat(chunks).toString('base64')

        tasks--
      })
    })

    while (tasks > 0) {
      await timeout(100)

 // avoid "'tasks' is not modified in this loop."
      tasks += 0
    }

    console.log('<html><head><title>OTP recovery sheet</title><body><table>')
    entries.forEach((entry) => {
      const escape = (s) => {
        const pairs =
          [
            [ /&/g, '&amp;' ],
            [ /"/g, '&quot;' ],
            [ /'/g, '&#39;' ],
            [ /</g, '&lt;' ],
            [ />/g, '&gt;' ]
          ]

        pairs.forEach((pair) => { s = s.replace(pair[0], pair[1]) })
        return s
      }

      console.log('<tr><td align="center"><img width="300" height="300" src="' + entry.dataURL + '" /><br/><b>' +
                  escape(entry.accountName) + '</b>' + (entry.issuer ? ('<br/>' + escape(entry.issuer)) : '') + '</td></tr>')
    })
    console.log('</table></body></html>')
  })
}

if (process.argv.length !== 3) {
  console.log('usage: ' + process.argv[0] + ' ' + process.argv[1] + ' input.json')
  process.exit(1)
}

worker(process.argv[2])
