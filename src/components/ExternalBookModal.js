import {  useState } from "react";
import ModalBackground from "./ModalBackground";
import {
    MODELS_API_AUTHORS_INDEX, MODELS_API_CATEGORIES_INDEX,
    MODELS_API_BOOKS_RECOMMENDATIONS_URL
} from "../externApi";
import styles from '../css/ExternalBookModal.module.css'
import SearchBar from "./SearchBar";
import RemovableFeature from "./RemovableFeature";
import categoryService from "../services/categoryService";
import authorService from "../services/authorService";

const ExternalBookModal = ({ display, setDisplay, setBooks }) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [categories, setCategories] = useState(new Map())
    const [authors, setAuthors] = useState(new Map())

    const addCategory = (id, name) => {
        if (categories.has(id) === false) {
            const categoriesCopy = new Map(categories)
            categoriesCopy.set(id, name)
            setCategories(categoriesCopy)
        }
    }

    const addAuthor = (id, name) => {
        if (authors.has(id) === false) {
            const authorsCopy = new Map(authors)
            authorsCopy.set(id, name)
            setAuthors(authorsCopy)
        }
    }

    const removeCategory = (id) => {
        const categoriesCopy = new Map(categories)
        categoriesCopy.delete(id)
        setCategories(categoriesCopy)
    }

    const removeAuthor = (id) => {
        const authorsCopy = new Map(authors)
        authorsCopy.delete(id)
        setAuthors(authorsCopy)
    }

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    const fetchAuthors = async (value) => {
        const data = await authorService.getAuthors(value)
        return data
    }

    const fetchCategories = async (value) => {
        const data = await categoryService.getCategories(value)
        return data
    }

    const categoriesDiv = [...categories.entries()].map(([id, name]) => {
        return (<RemovableFeature key={id} name={name} id={id} remove={removeCategory}></RemovableFeature>)
    })

    const authorsDiv = [...authors.entries()].map(([id, name]) => {
        return (<RemovableFeature key={id} name={name} id={id} remove={removeAuthor}></RemovableFeature>)
    })


    const submit = (e) => {
        e.preventDefault()
        let body = {
            content: title + ' ' + description,
            authors: [...authors].map(([id, name]) => name),
            categories: [...categories].map(([id, name]) => name)
        }
        const url = `${MODELS_API_BOOKS_RECOMMENDATIONS_URL}`
        fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setBooks(data)
                setDisplay(false)
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className="div-close-modal">
                    <button className='close-btn' onClick={() => setDisplay(false)}>X</button>
                </div>
                <h3 className={styles.title}>External book</h3>
                <form className={styles["main-form"]} onSubmit={submit}>
                    <input className={styles['input-title']} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}></input>
                    <textarea type='' className={styles['input-description']} placeholder="Description" value={description}
                        onChange={e => setDescription(e.target.value)}></textarea>
                    <div className={styles['feature-div']}>
                        <div className={styles['input-div']}>
                            <label>Category: </label>
                            <SearchBar fetchMethod={fetchCategories} dbColumnName={'name'}
                                setId={addCategory} clearValueOnSelect={true}></SearchBar>
                        </div>
                        <div className={styles["added-features"]}>
                            {categoriesDiv}
                        </div>
                    </div>
                    <div className={styles['feature-div']}>
                        <div className={styles['input-div']}>
                            <label>Author: </label>
                            <SearchBar fetchMethod={fetchAuthors} dbColumnName={'name'}
                                setId={addAuthor} clearValueOnSelect={true}></SearchBar>
                        </div>
                        <div className={styles["added-features"]}>
                            {authorsDiv}
                        </div>
                    </div>
                    <button className={`basic-btn-2 ${styles['submit-btn']}`}>Get recommendations</button>
                </form>
            </div>
        </ModalBackground>
    )
}

export default ExternalBookModal