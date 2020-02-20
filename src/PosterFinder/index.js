import React, { useState } from 'react'
import findMovies from './find-movies'

export default function PosterFinder() {
  const minMovieTitleLength = 3
  const [disableSearch, setDisableSearch] = useState(true)
  const [movieName, setMovieName] = useState('')
  const [msg, setMsg] = useState(
    `Digite pelo menos ${minMovieTitleLength} letras do título do filme.`
  )

  const [posters, setPosters] = useState([])

  function handleInput({ target: { value, minLength } }) {
    setDisableSearch(value.length < minLength)
    setMovieName(value)
  }

  function handleClick(e) {
    e.preventDefault()
    setMsg('Buscando...')
    setDisableSearch(true)
    setPosters([])
    findMovies({ movieTitle: movieName })
      .then(results => {
        console.log(results)
        if (results.error) {
          setMsg(results.error)
        } else if (results.movies.length === 0) {
          setMsg(`Desculpe, não conseguimos encontrar esse. Por favor, tente novamente.`)
        } else {
          setMsg(
            `Agora mostrando o primeiro ${results.movies.length} resultados de ${
            results.total
            }`
          )
          setPosters(results.movies)
          setDisableSearch(false)
        }
      })
      .catch(e => {
        setMsg('Algo deu errado. Por favor, tente novamente mais tarde.')
      })
  }

  return (
    <>
      <section className='PosterFinder'>
        <header className='header'>
          <h1>caioFlix</h1>
          <h3>
            Encontre seus posters de filmes favoritos.</h3>
        </header>
        <main>
          <p>
            <label className='label' htmlFor='movie-name'>

              Título do filme:
            </label>{' '}
            <input
              className='searchBox'
              type='search'
              id='movie-name'
              name='movie-name'
              value={movieName}
              onChange={handleInput}
              minLength={minMovieTitleLength}
              placeholder='digite o nome de um filme'
            />
            <button
              id='search-button'
              className='searchButton'
              disabled={disableSearch}
              onClick={handleClick}
            >
              Buscar
            </button>
            <br />
          </p>
          <p id='msg'>{msg}</p>
        </main>
        <section id='poster-grid' className='PosterGrid'>
          {posters.map(movie => (
            <img
              key={movie.title}
              src={
                movie.poster == null
                  ? `https://via.placeholder.com/300x468?text=${encodeURIComponent(
                    movie.title
                  )}`
                  : movie.poster
              }
              alt={movie.title}
              title={movie.title}
            />
          ))}
        </section>
      </section>
    </>
  )
}
