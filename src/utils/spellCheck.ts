const COMMON_MISSPELLINGS: Record<string, string> = {
  acheive: 'achieve',
  acheived: 'achieved',
  adress: 'address',
  arguement: 'argument',
  begining: 'beginning',
  beleive: 'believe',
  buisness: 'business',
  calender: 'calendar',
  commited: 'committed',
  committment: 'commitment',
  concensus: 'consensus',
  developement: 'development',
  enviroment: 'environment',
  experiance: 'experience',
  experienc: 'experience',
  goverment: 'government',
  grammer: 'grammar',
  independant: 'independent',
  knowlege: 'knowledge',
  liason: 'liaison',
  maintainance: 'maintenance',
  managment: 'management',
  neccessary: 'necessary',
  occassion: 'occasion',
  occuring: 'occurring',
  persue: 'pursue',
  priviledge: 'privilege',
  recieve: 'receive',
  recieved: 'received',
  refered: 'referred',
  relevent: 'relevant',
  responsability: 'responsibility',
  seperate: 'separate',
  succesful: 'successful',
  sucessful: 'successful',
  thier: 'their',
  untill: 'until',
  writting: 'writing',
}

const IGNORE_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'i', 'me',
  'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they', 'them', 'their',
])

function hasRepeatedLetterHeuristic(word: string): boolean {
  if (word.length < 4) return false
  if (/(.)\1{2,}/.test(word)) return true
  if (/([b-df-hj-np-tv-z])\1/.test(word) && !/ll|ss|ee|oo|tt|ff|nn|pp|rr|cc|mm/.test(word)) {
    return true
  }
  return false
}

export function checkSpelling(text: string): string[] {
  const suspicious = new Set<string>()
  const words = text.match(/[a-zA-Z']+/g) ?? []

  for (const raw of words) {
    const word = raw.toLowerCase()
    if (word.length < 3 || IGNORE_WORDS.has(word)) continue

    if (Object.prototype.hasOwnProperty.call(COMMON_MISSPELLINGS, word)) {
      suspicious.add(raw)
      continue
    }

    if (hasRepeatedLetterHeuristic(word)) {
      suspicious.add(raw)
    }
  }

  return [...suspicious]
}
