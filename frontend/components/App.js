import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axiosWithAuth from '../axios/index'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => {navigate('/articles')}

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage('Goodbye!')
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    // and launch a request to the proper endpoint.
    axios.post(loginUrl, {"username": username, "password": password})
    // On success, we should set the token to local storage in a 'token' key,
    .then((res) => {
      localStorage.setItem('token', res.data.token)
      // put the server success message in its proper state, and redirect
      // to the Articles screen. Don't forget to turn off the spinner!
      setMessage(res.data.message)
      redirectToArticles();
    })
    setSpinnerOn(false)
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setSpinnerOn(true);
    setMessage('');
    // and launch an authenticated request to the proper endpoint.
    axiosWithAuth().get(articlesUrl)
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    .then((res) => {
      console.log(res)
      setArticles(res.data.articles)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    .catch((err) => {
      console.log(err)
      if (err.response.status === 401) {
        redirectToLogin();
      }
      setSpinnerOn(false)
    })
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().post(`http://localhost:9000/api/articles`, article)
    .then((res) => {
      setArticles([...articles, res.data.article])
      setMessage(res.data.message)
      setSpinnerOn(false)
    }) 
    .catch((err) => {
      console.log(err)
      setSpinnerOn(false)
    })
  }

  const updateArticle = (articleId, updatedArticle) => {
    // ✨ implement
    // You got this!
    console.log("BOOP! UPDATED")
    const jsondArticle = JSON.stringify(updatedArticle)
    setMessage('');
    setSpinnerOn(true);
    axiosWithAuth().put(`http://localhost:9000/api/articles/${articleId}`, jsondArticle)
    .then((res) => {
      console.log(res)
      // Get all but the updated article
      const articlesSansUpdated = articles.filter((article) => {
        return article.article_id !== articleId;
      })
      articlesSansUpdated.push(res.data.article)
      setArticles(articlesSansUpdated)
      setMessage(res.data.message);
      setSpinnerOn(false);
    })
    .catch((err) => {
      console.log(err)
      setSpinnerOn(false);
    })
  }

  const deleteArticle = (articleId) => {
    // ✨ implement
    console.log("BOOP DELETED: " + articleId)
    // Here's how to do it in state:
    setSpinnerOn(true)
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${articleId}`)
    .then((res) => {
      const allButDeleted = articles.filter((article) => {
        return article.article_id !== articleId;
      })
      setArticles(allButDeleted)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch((err) => {
      console.log(err)
      setSpinnerOn(false)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId} 
                articles={articles}/>
              <Articles 
                updateArticle={updateArticle}
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                redirectToLogin={redirectToLogin}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
