var finder = document.querySelector('#finder'),
  list = document.querySelector('#list'),
  lib = library()

finder.addEventListener('keyup', onKeydown)

// basic usage
function onKeydown(e) {
  if (!e.target.value) {
    list.innerHTML = ''
    return
  }
  var results = FS.search(e.target.value, lib)
  if (results.success) {
    outputSearchResults(results)
    console.log(results)
  } else {
    console.error(results)
  }
}

// handling search results
function outputSearchResults(results) {
  // clear list
  list.innerHTML = ''

  // you deleted the last letter, do nothing more
  if (results.count === lib.length) return

  // label exact
  if (results.exact.length) label(list, 'Exact Matches')
  // spit out exacts
  outputMatches(results.exact)

  // no need to go further unless fuzzy
  if (!results.fuzzy.length) return

  // label fuzzy
  if (results.fuzzy.length) label(list, 'Fuzzy Matches')
  // spit out fuzzies
  outputMatches(results.fuzzy)
}

// outputting matches
function outputMatches(matchesArray) {
  matchesArray.forEach((match) => {
    var el = document.createElement('li')
    match._substrings.forEach((str) => {
      if (str.match) {
        el.innerHTML += `<strong>${str.str}</strong>`
      } else {
        el.innerHTML += str.str
      }
    })
    list.appendChild(el)
  })
}

// labeling output
function label(list, text) {
  var line = document.createElement('li')
  line.innerHTML = text
  line.className = 'label'
  list.appendChild(line)
}

// we would probably sort these names by last touched so that "recent" has value
// it will still prefer an exact match over a fuzzy,
// but each would be sorted by this order
function library() {
  return [
    'illamon',
    'fragment',
    'latterly',
    'dysgenics',
    'zupus',
    'lecuona',
    'gawkiness',
    'unspiced',
    'lymphoma',
    'payable',
    'befouler',
    'tribune',
    'hespera',
    'natality',
    'chowhound',
    'norene',
    'kelebe',
    'datolite',
    'splay',
    'convey',
    'sita',
    'artemisia',
    'gasolene',
    'epicurean',
    'pretext',
    'deschutes',
    'elkanah',
    'cantal',
    'jar',
    'portiere',
    'trainpipe',
    'limbate',
    'silage',
    'cissy',
    'nip',
    'fubsiest',
    'inhale',
    'fusilier',
    'unfunded',
    'yapper',
    'scheele',
    'jiva',
    'saturator',
    'catalyst',
    'telephony',
    'abby',
    'kazachok',
    'tuileries',
    'judah',
    'boiardo',
    'unlotted',
    'terry',
    'charvaka',
    'beguiler',
    'thorburn',
    'speiss',
    'similarly',
    'target',
    'overcame',
    'unshaking',
    'pyrexia',
    'mangonel',
    'heath',
    'monaural',
    'proexpert',
    'strobila',
    'subchaser',
    'daric',
    'gregg',
    'rattly',
    'ladd',
    'unrayed',
    'kastro',
    'metol',
    'syce',
    'mood',
    'rsvp',
    'hornsby',
    'perutz',
    'steeper',
    'tephrite',
    'flabbier',
    'kikuyu',
    'slopshop',
    'marciano',
    'packer',
    'ungalled',
    'grenfell',
    'crosstree',
    'horrocks',
    'pulpiest',
    'evert',
    'unscribed',
    'shamrock',
    'promote',
    'raking',
    'kahuna',
    'glassy',
    'tippable',
  ]
}
