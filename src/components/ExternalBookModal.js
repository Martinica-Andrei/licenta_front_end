import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import { MODELS_API_AUTHORS_INDEX, MODELS_API_CATEGORIES_INDEX } from "../externApi";
import styles from '../css/ExternalBookModal.module.css'
import SearchBar from "./SearchBar";
import RemovableFeature from "./RemovableFeature";

const ExternalBookModal = ({ display, setDisplay }) => {

    const [categories, setCategories] = useState(new Map())
    const [authors, setAuthors] = useState(new Map())

    const addCategory = (id, name) =>{
        if (categories.has(id) === false){
            const categoriesCopy = new Map(categories)
            categoriesCopy.set(id, name)
            setCategories(categoriesCopy)
        }
    }

    const addAuthor = (id, name) => {
        if (authors.has(id) === false){
            const authorsCopy = new Map(authors)
            authorsCopy.set(id, name)
            setAuthors(authorsCopy)
        }
    }

    const removeCategory = (id) =>{
        const categoriesCopy = new Map(categories)
        categoriesCopy.delete(id)
        setCategories(categoriesCopy)
    }

    const removeAuthor = (id) =>{
        const authorsCopy = new Map(authors)
        authorsCopy.delete(id)
        setAuthors(authorsCopy)
    }

    const attributes = {
        onClick: (e) => {
            setDisplay(false)
        }
    }

    const createEndpointCategories = (value) => {
        return `${MODELS_API_CATEGORIES_INDEX}?name=${value}`
    }

    const createEndpointAuthors = (value) => {
        return `${MODELS_API_AUTHORS_INDEX}?name=${value}`
    }

    const categoriesDiv = [...categories.entries()].map(([id, name]) =>{
        return (<RemovableFeature key={id} name={name} id={id} remove={removeCategory}></RemovableFeature>)
    })

    const authorsDiv = [...authors.entries()].map(([id, name]) =>{
        return (<RemovableFeature key={id} name={name} id={id} remove={removeAuthor}></RemovableFeature>)
    })


    return (
        <ModalBackground display={display} setDisplay={setDisplay} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>External book</h3>
                <button className={`close-btn ${styles['close-btn']}`} onClick={() => setDisplay(false)}>X</button>
                <div className={styles["form-div"]}>
                    <input className={styles['input-title']} placeholder="Title"></input>
                    <textarea type='' className={styles['input-description']} placeholder="Description"></textarea>
                    <div className={styles['feature-div']}>
                        <div className={styles['input-div']}>
                            <label>Category: </label>
                            <SearchBar createEndpoint={createEndpointCategories} dbColumnName={'name'} setId={addCategory} clearValueOnSelect={true}></SearchBar>
                        </div>
                        <div className={styles["added-features"]}>
                            {categoriesDiv}
                        </div>
                    </div>
                    <div className={styles['feature-div']}>
                        <div className={styles['input-div']}>
                            <label>Author: </label>
                            <SearchBar createEndpoint={createEndpointAuthors} dbColumnName={'name'} setId={addAuthor} clearValueOnSelect={true}></SearchBar>
                        </div>
                        <div className={styles["added-features"]}>
                            {authorsDiv}
                        </div>
                    </div>
                    <button className={`basic-btn-2 ${styles['submit-btn']}`}>Get recommendations</button>
                </div>
            </div>
        </ModalBackground>
    )
}

export default ExternalBookModal