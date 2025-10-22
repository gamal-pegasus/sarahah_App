import axios from "axios";
export async function getIpCountry(ip) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    // const response  = geoip.lookup(ip);
    return response.data;
  } catch (err) {
    console.log("Error fetching country:", err.message);
    return { country_code: "Unknown" };
  }
}