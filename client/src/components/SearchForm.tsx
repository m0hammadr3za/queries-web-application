import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import searchIcon from "../assets/search.svg";
import "../styles/SearchForm.scss";

import { startPostsLoading, finishPostsLoading } from "../redux/slices/loadingSlice";

import {
    selectSort,
    changeSearch,
    changePage,
    loadPosts,
} from "../redux/slices/postsSlice";

function SearchForm() {
    const sort = useSelector(selectSort);

    const [searchInput, setSearchInput] = useState("");

    const dispatch = useDispatch();

    function handleSearchInput(e: any) {
        setSearchInput(e.target.value);
    }

    async function handleSubmitForm(e: any) {
        e.preventDefault();

        // check if the search string is just a bunch of spaces
        let isEmptyString = true;
        for (let char of searchInput) if (char !== " ") isEmptyString = false;
        if (searchInput === "" || isEmptyString) return;

        dispatch(startPostsLoading());

        const res = await fetch(`/api/posts?search=${searchInput}&sort=${sort}&page=1`);
        const newPosts = await res.json();
        dispatch(loadPosts(newPosts));

        dispatch(changeSearch(searchInput));
        dispatch(changePage(1));

        dispatch(finishPostsLoading());
    }

    return (
        <form className="search-form" onSubmit={handleSubmitForm}>
            <div className="search-form__icon">
                <img src={searchIcon} alt="search" />
            </div>

            <div>
                <label htmlFor="posts-search" hidden>
                    Search
                </label>

                <input
                    className="search-form__text-input"
                    id="posts-search"
                    type="text"
                    placeholder="Search"
                    autoComplete="off"
                    maxLength={64}
                    value={searchInput}
                    onChange={handleSearchInput}
                />
            </div>
        </form>
    );
}

export default SearchForm;
