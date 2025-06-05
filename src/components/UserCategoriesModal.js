import { useEffect, useContext, useState } from "react";
import ModalBackground from "./ModalBackground";
import AuthContext from '../contexts/AuthContext'
import styles from '../css/UserCategoriesModal.module.css'
import categoryService from "../services/categoryService";

const UserCategoriesModal = ({ display, setDisplay }) => {

    const [isAuth, setIsAuth] = useContext(AuthContext)
    const [categorySearch, setCategorySearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [categories, setCategories] = useState([])

    const setDisplayWrapper = (v) => {
        setCategorySearch('')
        setCategoryFilter('All')
        setDisplay(v)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await categoryService.getCategories('')
            if (data.length > 0 && !Object.hasOwn(data[0], 'liked')) {
                setIsAuth(false)
                setDisplayWrapper(false)
            }
            else {
                setCategories(data)
            }
        }
        fetchCategories()
    }, [display])

    const attributes = {
        onClick: (e) => {
            setDisplayWrapper(false)
        }
    }

    const rateCategory = async (category, is_like) => {
        const status = await categoryService.likeCategory(category, is_like)

        if (status == 200) {
            setCategories([...categories])
        }
        else if (status === 401 || status === 403) {
            setIsAuth(false)
            setDisplayWrapper(false)
        }
    }

    const categoriesFiltered = categories.filter(v => v.name.includes(categorySearch) && (categoryFilter === 'All' || v.liked))
    const categoriesDiv = categoriesFiltered.map((v) =>
    (
        <div key={v.id}>
            <label>{v.name}</label>
            <input type='checkbox' checked={v.liked} onChange={e => rateCategory(v, e.target.checked)}></input>
        </div>)
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