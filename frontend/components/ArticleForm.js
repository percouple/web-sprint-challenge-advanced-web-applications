import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import axiosWithAuth from '../axios';

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here

  const { articles, currentArticleId, postArticle, updateArticle, setCurrentArticleId} = props;

  // Fill inputs with current editing article
  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    if (currentArticleId) {
      const [currentArticle] = articles.filter((article) => {
        return article.article_id === currentArticleId
      })
      console.log(currentArticle)
      setValues({ 
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic
      })
    } else {
      setValues(initialFormValues)
    }
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
  }, [currentArticleId])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onCancel = () => {
    setValues(initialFormValues)
    setCurrentArticleId('')
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    if (currentArticleId) {
      updateArticle( currentArticleId, values )
      setValues(initialFormValues)
    } else {
      postArticle(values);
      setValues(initialFormValues);
    }
    
  }

  // Submit button validation
  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    if (Object.values(values).every((value) => value.trim())) {
      console.log('Submit/Edit box validated!')
      return false
    } else {
      return true;
    }
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticleId ? 'Edit' : 'Create'} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button> 
        {currentArticleId ? <button onClick={onCancel}>Cancel edit</button> : ''}
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
