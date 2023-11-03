const backendUrl =
  process.env.NODE_ENV === "production"
    ? `https://the-box-social-media-bryansan26.herokuapp.com/`
    : "http://localhost:8080/";
export default backendUrl;
