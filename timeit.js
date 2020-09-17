function elapsed (hrstart, msg) {
  const hrend = process.hrtime(hrstart)
  console.info(`${msg} Execution time (hr): %ds %dms`, hrend[0], hrend[1] / 1000000)
}

function t1 (s) {
  return s.replace(/-/g, '+').replace(/_/g, '/').replace(/#/g, '')
}
function t2 (s) {
  return c(s.replace(/-/g, '+').replace(/_/g, '/'))
}

function f1 (s) {
  const b = Buffer.from(s)
  while (true) {
    const i = b.indexOf(65)
    if (i === -1) break
    b[i] = 66
  }
  while (true) {
    const i = b.indexOf(67)
    if (i === -1) break
    b[i] = 68
  }
  return Buffer.toString()
}

function c (s) { const i = s.indexOf('#'); return i < 0 ? s : s.substr(0, i) }

let o = ''

const hr1 = process.hrtime()
const ii = '-_-_###'
for (let i = 0; i < 1000000; i++) { o = t1(ii) }
elapsed(hr1, 'time1 ' + o)
const hr2 = process.hrtime()
for (let i = 0; i < 1000000; i++) { o = t2(ii) }
elapsed(hr2, 'time2 ' + o)
const hr3 = process.hrtime()
for (let i = 0; i < 1000000; i++) { o = f1('ABCDABCDABCD') }
elapsed(hr3, 'time3 ' + o)
