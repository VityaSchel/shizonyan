import React from 'react'
import logo from './logo.svg'
import './App.scss'
import Spinner from 'react-bootstrap/Spinner'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App">
      <TweetArea />
      <Footer />
    </div>
  )
}

function TweetArea() {
  return (
    <div id="area">
      <div id="tweet-inner">
        <div id="tweet-heading">
          <svg viewBox="0 0 24 24"><g><path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g></svg>
        </div>
        <div id="tweet-content">
          <div id="user-avatar">
            <img src="/picture.png" width="48" height="48" alt="Автарка"/>
          </div>
          <div id="tweet-editor">
            <TweetText />
            <div id="tweet-buttonbar">
              <div id="tweet-bar-buttons">
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
              </div>
              <TweetButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

let srcTweet = '', index = 0
function TweetText() {
  const textarea = React.useRef()

  const handleKeyDown = event => {
    if(event.ctrlKey) return
    event.preventDefault()
    textarea.current.value += srcTweet[index] ?? ''
    index++
    textarea.current.scrollTo(0, 99999)
    return false
  }

  const block = event => {
    event.preventDefault()
  }

  const blockEvents = {
    onKeyUp: block,
    onInput: block,
    onKeyPress: block,
    onPaste: block,
    onCut: block,
  }

  return (
    <>
      <textarea onKeyDown={handleKeyDown} id="only-android"
        ></textarea>
      <textarea spellCheck="false" onKeyDown={handleKeyDown}
        placeholder="Что происходит? Напечатайте текст на клавиатуре..." ref={textarea} id="tweet-text"></textarea>
    </>
  )
}

function ButtonPlaceholder() {
  return <div className="button-placeholder"></div>
}

function TweetButton() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    document.querySelector('#tweet-text').setAttribute('disabled', 'disabled')
    await loadNewSentence()
    setIsLoading(false)
    document.querySelector('#tweet-text').removeAttribute('disabled')
  }

  return (
    <button id="tweet-action" onClick={handleClick}>{
      isLoading?
      <Spinner animation="border" variant="light" size="sm" />
      :'Твитнуть'
    }</button>
  )
}

async function loadSentences() {
  // previously it was using '/generator' endpoint which actually generated sentence on compiled model using python3
  // then I generated ~1000 sentences and saved to text file, leaving /generator to read from this file
  // unfortunately I have little RAM so I had to stop nodejs server and make the file static
  const response = await fetch('/generated.txt')
  const sentences = await response.text()
  window.sentences = sentences.split('\n')
  loadNewSentence()
}

window.addEventListener('load', () => loadSentences())

async function loadNewSentence() {
  await new Promise(resolve => setInterval(() => window.sentences && resolve()))
  document.querySelector('#tweet-text').value = ''
  srcTweet = window.sentences[Math.floor(Math.random() * window.sentences.length)]
  index = 0
  return true
}

function Footer() {
  return (
    <footer>
      <p>
        Шизоньян — генератор твитов <a href="https://twitter.com/M_Simonyan">Маргариты Симоньян</a>.
        <a href='https://github.com/VityaSchel/shizonyan'>Репозиторий на GitHub</a>.
        Автор: VityaSchel / 2021
      </p>
      <p>
        ИИ использует цепи маркова, натренировано на ~15 тыс твитах Маргариты с 2012 по 2021 годы.
      </p>
    </footer>
  )
}

export default App
