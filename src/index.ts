import './style.css'

const root = document.querySelector<HTMLElement>(':root')!
const searchParams = new URLSearchParams(location.search)
const step = Number(searchParams.get('step')) || 3
const bg = searchParams.get('bg') ?? '000'
root.style.setProperty('--bg', `#${bg}`)

const app = document.querySelector('#app')!
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!

const state = {
  hue: 0,
  stepX: step,
  stepY: step,
  directionX: 'left',
  directionY: 'down',
  height: app.clientHeight,
  width: app.clientWidth,
  image: new Image(),
  imageX: 0,
  imageY: 0
}

state.height = app.clientHeight
state.width = app.clientWidth
canvas.height = state.height
canvas.width = state.width
app.appendChild(canvas)

function render() {
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillRect(0, 0, state.width, state.height)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = `hsla(${state.hue}, 50%, 45%, 1)`
  ctx.fillRect(0, 0, state.width, state.height)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(
    state.image,
    state.imageX,
    state.imageY,
    state.image.width,
    state.image.height
  )

  updateDirection()
  updateHue()

  requestAnimationFrame(() => render())
}

function updateDirection() {
  if (state.directionX == 'left') {
    if (state.imageX >= state.width - state.image.width) {
      state.directionX = 'right'
      state.imageX = state.imageX - state.stepX
    } else {
      state.imageX = state.imageX + state.stepX
    }
  } else {
    if (state.imageX <= 0) {
      state.directionX = 'left'
      state.imageX = state.imageX + state.stepX
    } else {
      state.imageX = state.imageX - state.stepX
    }
  }

  if (state.directionY == 'down') {
    if (state.imageY >= state.height - state.image.height) {
      state.directionY = 'up'
      state.imageY = state.imageY - state.stepY
    } else {
      state.imageY = state.imageY + state.stepY
    }
  } else {
    if (state.imageY <= 0) {
      state.directionY = 'down'
      state.imageY = state.imageY + state.stepY
    } else {
      state.imageY = state.imageY - state.stepY
    }
  }
}

function updateHue() {
  state.hue = (state.hue + 0.5) % 360
}

function onResize() {
  state.width = canvas.width = window.innerWidth
  state.height = canvas.height = window.innerHeight
}

async function loadImage() {
  new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.src = searchParams.get('image') || './dvd.png'

    image.onload = () => {
      state.imageX = Math.floor(
        Math.random() * (state.width - state.image.width)
      )
      state.imageY = Math.floor(
        Math.random() * (state.height - state.image.height)
      )
      resolve()
    }

    image.onerror = (err) => {
      reject(err)
    }

    state.image = image
  })
}

loadImage()
  .then(() => {
    window.addEventListener('resize', () => onResize())
    onResize()
    render()
  })
  .catch(console.log)
