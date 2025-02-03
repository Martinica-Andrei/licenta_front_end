import React, { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import { MODELS_API_ME_URL, MODELS_API_BOOKS_RATE_URL, MODELS_API_CATEGORIES_INDEX, MODELS_API_CATEGORIES_LIKE } from "../externApi";
import styles from '../css/UserCategoriesModal.module.css'
import { getCSRFToken } from "../utils";

const UserCategoriesModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [categorySearch, setCategorySearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [categories, setCategories] = useState([])

    const setDisplayWrapper = (v) =>{
        setCategorySearch('')
        setCategoryFilter('All')
        setDisplay(v)
    }

    useEffect(() => {
        if (display === false) {
            return
        }
        const url = `${MODELS_API_CATEGORIES_INDEX}?name=${categorySearch}`
        fetch(url, { credentials: 'include' })
            .then(res => Promise.all([res, res.json()]))
            .then(([res, data]) => {
                if (res.status === 200) {
                    setCategories(data)
                }
                else if (res.status === 401 || res.status === 403) {
                    setIsAuth(false)
                    setDisplayWrapper(false)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplayWrapper(false)
        }
    }

    const rateCategory = (index, v, id) => {
        const categoriesCopy = [...categories]
        categoriesCopy[index].liked = v
        setCategories(categoriesCopy)

        const body = {
            id: id,
            like: v
        }
        fetch(MODELS_API_CATEGORIES_LIKE,
            {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    setIsAuth(false)
                    setDisplayWrapper(false)
                }
            })
    }

    // map without filter to preserve index for liking
    const categoriesDiv = categories.map((v, index) => {
        if (v.name.includes(categorySearch) && (categoryFilter === 'All' || v.liked)) {
            return (
                <div key={index}>
                    <label>{v.name}</label>
                    <input type='checkbox' checked={v.liked} onChange={e => rateCategory(index, e.target.checked, v.id)}></input>
                </div>)
        }
        else {
            return undefined
        }
    }
    )

    return (
        <ModalBackground display={display} setDisplay={setDisplayWrapper} divAttributes={attributes}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>Liked Categories</h3>
                <button className={`close-btn ${styles['close-btn']}`} onClick={() => setDisplayWrapper(false)}>X</button>
                <div>
                    <label>Search: </label>
                    <input value={categorySearch} onChange={e => setCategorySearch(e.target.value)}></input>
                </div>
                <select className={styles.dropdown} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value='All'>All</option>
                    <option value='Liked'>Liked</option>
                </select>
                <div className={styles['categories-div']}>
                    {categoriesDiv.length > 0 && categoriesDiv}
                </div>
            </div>
        </ModalBackground>
    )
}

export default UserCategoriesModal