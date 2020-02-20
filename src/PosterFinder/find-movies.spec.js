import { buildMovieQuery, normalizeMovieResults } from './find-movies'

describe('find movies', () => {
  it('cria uma consulta de filme', () => {
    const movieTitle = 'Batman'
    const expected = {
      method: 'GET',
      url: 'https://omdbapi.com/',
      params: {
        s: encodeURIComponent(movieTitle),
        apikey: process.env.REACT_APP_API_KEY
      }
    }
    expect(buildMovieQuery({ movieTitle })).toEqual(expected)
  })
  it('lida com voltar sem resultados', () => {
    const zeroResults = {
      Response: 'False',
      Error: 'Filme não encontrado!'
    }
    const expected = {
      total: 0,
      movies: []
    }
    expect(normalizeMovieResults(zeroResults)).toEqual(expected)
  })
  it('lida com erros de API', () => {
    const apiError = {
      Response: 'False',
      Error: 'Kablamo!'
    }
    const expected = { error: apiError.Error }

    expect(normalizeMovieResults(apiError)).toEqual(expected)
  })

  it('normaliza os resultados da consulta', () => {
    const dummyPosters = {
      Response: 'True',
      Search: [
        {
          Title: 'Star Wars: Episode IV - A New Hope',
          Year: '1977',
          imdbID: 'tt0076759',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
        },
        {
          Title: 'Star Wars: Episode V - The Empire Strikes Back',
          Year: '1980',
          imdbID: 'tt0080684',
          Type: 'movie',
          Poster: 'N/A'
        }
      ],
      totalResults: '438'
    }

    const expected = {
      movies: [
        {
          title: 'Star Wars: Episode IV - A New Hope',
          year: '1977',
          id: 'tt0076759',
          type: 'movie',
          poster:
            'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
        },
        {
          title: 'Star Wars: Episode V - The Empire Strikes Back',
          year: '1980',
          id: 'tt0080684',
          type: 'movie',
          poster: null
        }
      ],
      total: '438'
    }

    expect(normalizeMovieResults(dummyPosters)).toEqual(expected)
  })
})
