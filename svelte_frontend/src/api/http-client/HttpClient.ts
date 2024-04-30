class HttpClient {
  domain: string;
  constructor(domain: string) {
    this.domain = domain;
  }
  get = async <T>(path: string) => {
    const response = await fetch(`${this.domain}${path}`);
    const data = await response.json();
    return data as T;
  };
  post = async <T>(path: string, body: unknown) => {
    const response = await fetch(`${this.domain}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return data as T;
  };
}
export default HttpClient;
