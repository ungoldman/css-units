import units from 'units-css'
import html from 'nanohtml'
import devtools from 'choo-devtools'
import choo from 'nanochoo'
import 'bulma/css/bulma.css'

var app = choo()

app.use(devtools())

app.use(function (state, emitter) {
  state.units = {
    px: '',
    in: '',
    cm: ''
  }

  emitter.on('input', function (key, val) {
    state.units[key] = val
    var others = Object.keys(state.units).filter(k => k !== key)
    others.forEach(o => {
      state.units[o] = units.convert(o, `${val}${key}`)
    })
    emitter.emit('render')
  })
})

app.view(function (state, emit) {
  return html`
    <body>
      <section class="section">
        <h1 class="title">css unit converter</h1>
        ${Object.keys(state.units).map(key => html`
          <div class="field has-addons">
            <p class="control is-expanded">
              <input class="input"
                type="number"
                name=${key}
                oninput=${oninput}
                placeholder=${key}
                value=${state.units[key]}>
            </p>
            <p class="control">
              <a class="button is-static">${key}</a>
            </p>
        `)}
      </section>
    </body>
  `

  function oninput (e) {
    var key = e.target.name
    var val = e.target.value
    emit('input', key, val)
  }
})

app.mount('body')
