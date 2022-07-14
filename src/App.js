import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

const clientId = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [query, setQuery] = useState("");


  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlQuery = `&query=${query}`;
    const urlPage = `&page=${pageCurrent}`;
    if (query) {
      url = `${searchUrl}${clientId}${urlQuery}${urlPage}`;
    } else {
      url = `${mainUrl}${clientId}${urlPage}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data)
      setPhotos((prev) => {
        if(pageCurrent===1 && query){
          
          return data.results;
        }
        
        else if(query && pageCurrent !== 1 ) {
          console.log(pageCurrent);

          return [...prev,...data.results];
        }else{
          return [...prev,...data];

        }
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [pageCurrent]);

  useEffect(() => {
    // setPageCurrent(1);

    const event = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPageCurrent((prev) => prev + 1);
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
   

    if (!query) return;
    
    if(pageCurrent ===1){

      fetchImages();
    }else{
      setPageCurrent(1)
      // fetchImages();
    }
    
    // setPageCurrent(1);



  };
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search"
            className="form-input"
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
