import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PT from 'prop-types';
import axios from 'axios';

export default function Articles(props) {
  // ✨ where are my props? Destructure them here
  const { redirectToLogin, updateArticle, articles, getArticles, deleteArticle, setCurrentArticleId, currentArticleId } = props;

  // ✨ implement conditional logic: if no token exists
  if (!localStorage.getItem('token')) {
    // we should render a Navigate to login screen (React Router v.6)
    console.log("TOKEN NOT HERE")
    return (
      <Navigate to="/"/>
    )
  }

  // ✨ grab the articles here, on first render only
  useEffect(() => {
    getArticles()
  }, [])

  // clickHandler for edit and delete buttons
  const clickHandler = (e) => {
    const selectedArticleTitle = e.target.parentElement.previousSibling.childNodes[0].textContent
    const [ selectedArticle ] = articles.filter((article) => {
      return article.title === selectedArticleTitle;
    })
    if (e.target.textContent === 'Delete') {
      deleteArticle(selectedArticle.article_id);
    } else if (e.target.textContent === 'Edit') {
      setCurrentArticleId(selectedArticle.article_id)
    }
  }

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !articles.length
          ? 'No articles yet'
          : articles.map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button disabled={false} onClick={clickHandler}>Edit</button>
                  <button disabled={false} onClick={clickHandler}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
