const backendUrl =
  process.env.NODE_ENV === "production"
    ? `https://the-box-social-media-2553517d56a9.herokuapp.com/`
    : "http://localhost:8080/";
export default backendUrl;
