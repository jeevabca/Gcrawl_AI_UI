import axios from "axios";
import Cookies from "js-cookie";

export const performSearch = async (query: string) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  const token = Cookies.get("token");
  
  try {
    const response = await axios.post(
      `${baseUrl}/api/v1/search`,
      { 
        query: query,
        limit: 10 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-Key": "gspl-260526105644+84b437a1"
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Search API Error:", error);
    throw error;
  }
};
