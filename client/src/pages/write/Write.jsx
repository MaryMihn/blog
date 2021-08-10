import "./write.css";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "../../contex/Context";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCat] = useState("music");
  const { user } = useContext(Context);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      const res = await axios.get("/category");
      setCats(res.data);
    };
    getCats();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setCat(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      title,
      desc,
      username: user.username,
      category,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload", data);
      } catch (e) {}
    }
    try {
      const res = await axios.post("/posts", newPost);

      window.location.replace("/post/" + res.data._id);
    } catch (e) {}
  };

  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            className="writeInput"
            placeholder="Title"
            type="text"
            autoFocus={true}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="sidebarItem">
          <span className="sidebarTitle">CATEGORIES</span>
          <select onChange={handleChange} className="select" value={category}>
            {cats.map((c) => (
              <option key={c.name} className="sidebarListItem" value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="writeFormGroup">
          <textarea
            className="writeInput writeText"
            placeholder="Tell your story..."
            type="text"
            autoFocus={true}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
