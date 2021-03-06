const constants = {
  Difficulties: {
      0: {
        numeric: 0,
        title: 'Very Easy'
      },
      1: {
        numeric: 1,
        title: 'Easy'
      },
      2: {
        numeric: 2,
        title: 'Easy/Medium'
      },
      3: {
        numeric: 2.5,
        title: 'Medium'
      },
      4: {
        numeric: 3,
        title: 'Medium/Hard'
      },
      5: {
        numeric: 4,
        title: 'Hard'
      },
      6: {
        numeric: 5,
        title: 'Very Hard'
      }
  },
  Categories: [
    'Cover',
    'Lesson',
    'Arrangement',
    'Original Composition',
    'Backing Track'
  ],
  PlayingStyles: [
    'Finger',
    'Slap',
    'Tap',
    'Pick'
  ],
  MusicalStyles: [
    'Funk',
    'Rock',
    'Pop',
    'Jazz',
    'Acid Jazz',
    'Soul',
    'RnB',
    'Disco',
    'Blues',
    'Punk',
    'Ska',
    'House',
    'Reggae',
    'Hip hop',
    'Trance',
    'Gospel',
    'Country',
    'Folk',
    'Indie',
    'Alternative',
    'Metal',
    'Techno',
    'Rock and Roll',
    'Merengue',
    'Salsa'
  ]
}

Object.defineProperty(constants.PlayingStyles, 'from', {value: 'static', writable: true})
constants.PlayingStyles.from = (values) => {
  return values.map(value => {
    return value.charAt(0).toUpperCase() + value.slice(1)
  })
}

Object.defineProperty(constants.MusicalStyles, '_lower', {value: 'static', writable: true})
Object.defineProperty(constants.MusicalStyles, 'from', {value: 'static', writable: true})
constants.MusicalStyles._lower = constants.MusicalStyles.map(value => { return value.toLowerCase() })
constants.MusicalStyles.from = (values) => {
  return values.map((value, pos) => {
    const index = constants.MusicalStyles._lower.indexOf(value.toLowerCase())
    if (index !== -1) {
      return constants.MusicalStyles[index]
    }
    return value
  })
}

export default constants
