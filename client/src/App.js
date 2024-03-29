import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  axios.defaults.withCredentials = true;
  const handleUpload = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("file", file);

    try {
      await axios.post("https://imageuploader-server.vercel.app/upload", formdata);
      const response = await axios.get("https://imageuploader-server.vercel.app/getImage");
      setImages(response.data.map((item) => item.image));
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    axios
      .get("https://imageuploader-server.vercel.app/getImage")
      .then((res) => setImages(res.data.map((item) => item.image)))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="bg-gray-200">
      <div className="flex justify-center py-2">
      <form  onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          className="bg-red-500 text-white rounded-lg px-2 py-1"
          type="submit"
        >
          Upload
        </button>
        <br />
      </form>
      </div>
      
      <div className="w-full flex flex-wrap">
        {images &&
          images.length > 0 &&
          images.map((image, index) => (
            <img
              className="w-48 h-48 m-2 p-1"
              key={index}
              src={`https://imageuploader-server.vercel.app/Images/${image}`}
              alt={`image_${index}`}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
