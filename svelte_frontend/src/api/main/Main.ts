import HttpClient from "../http-client/HttpClient";

class Main extends HttpClient {
  constructor() {
    super(import.meta.env.VITE_BASE_API_URL);
  }
}

export default new Main();
