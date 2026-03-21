import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'

const App = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));

    window.addEventListener('changeContentView', (e) => {
      setContentView(e.detail);
    });
  }, []);

  useEffect(() => {
    const firstCategory = categories[0];
    if (firstCategory) {
      setCategory(firstCategory);

      // Fetch notes
      fetch(`/api/notes/${firstCategory}`)
        .then(response => response.json())
        .then(data => {
          Promise.all(data.map(async note => {
            try {
              const response = await fetch(`/notes/${firstCategory}/${note}`);
              const content = await response.text();
              return ({ name: note, content });
            } catch (error) {
              console.error(`Failed to fetch note ${note}:`, error);
              return null;
            }
          }))
            .then(results => {
              const validResults = results.filter(result => result !== null);
              setNotes(validResults);
            });
        })
        .catch(error => console.error(error));
    }
  }, [categories]);

  return (
    <div>
      <ReactMarkdown>
        {category}
      </ReactMarkdown>
      {notes.map(note => (
        <div id={note.name} key={note.name}>
          <ReactMarkdown children={note.content} rehypePlugins={[rehypeRaw]} />
        </div>
      ))}
    </div>
  )
}

export default App
