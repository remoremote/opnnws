import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://myallies-breaking-news-v1.p.rapidapi.com/GetCompanyDetailsBySymbol?symbol=twtr', {
          headers: {
            'X-RapidAPI-Key': 'fa00ed0b5emsh0cfc2bed1d96245p19e0d1jsna00df65a08d3',
            'X-RapidAPI-Host': 'myallies-breaking-news-v1.p.rapidapi.com'
          }
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  return (
    React.createElement('div', null,
      React.createElement('h1', null, 'Latest News'),
      React.createElement('ul', null,
        news.map(article =>
          React.createElement('li', { key: article.title },
            React.createElement('h2', null, article.title),
            React.createElement('img', { src: article.urlToImage, alt: article.title }),
            React.createElement('p', null, article.description),
            React.createElement('p', null, article.author),
            React.createElement('p', null, article.publishedAt)
          )
        )
      )
    )
  );
};

module.exports = News;
