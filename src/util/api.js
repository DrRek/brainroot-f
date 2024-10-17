/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from "@tanstack/react-query";

const base_url =
  window.location.hostname === "localhost"
    ? "http://localhost:43231"
    : "http://158.180.232.214:43231";

async function request({ url, method = "GET", headers = {}, body = null }) {
  try {
    // Set up the request options
    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": localStorage.getItem("API_KEY"),
        ...headers, // Spread operator to include additional headers
      },
      body: body ? JSON.stringify(body) : null, // Convert body to JSON if provided
    };

    // Make the request
    const response = await fetch(base_url + url, options);

    // Check if the response is okay (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error during request:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

const cached_request = (
  { url, method = "GET", headers = {}, body = null },
  queryOptions = {}
) =>
  useQuery({
    queryKey: [url, method, body],
    queryFn: () => request({ url, method, headers, body }),
    staleTime: 60000,
    ...queryOptions,
  });

export const list_accounts = () =>
  cached_request({ url: "/accounts" }, { placeholderData: [] });

export const delete_account = async (obj) =>
  request({ url: `/accounts/${obj.id}`, method: "DELETE" });

export const set_account = async (obj) =>
  obj.id
    ? request({ url: `/accounts/${obj.id}`, method: "PUT", body: obj })
    : request({ url: "/accounts", method: "POST", body: obj });

export const list_templates = () => cached_request({ url: "/templates" });

export const delete_template = async (obj) =>
  request({ url: `/templates/${obj.id}`, method: "DELETE" });

export const set_template = async (obj) =>
  obj.id
    ? request({ url: `/templates/${obj.id}`, method: "PUT", body: obj })
    : request({ url: "/templates", method: "POST", body: obj });

export const list_scheduledjobs = () => cached_request({ url: "/jobs" });

export const delete_scheduledjob = async (obj) =>
  request({ url: `/jobs/${obj.id}`, method: "DELETE" });

export const generate_post_proposal_get_suggested_time = async (body) =>
  request({ url: `/generate_post_proposal_get_suggested_time`, method: "POST", body });

export const generate_post_proposal_get_suggested_texts = async (body) =>
  request({ url: `/generate_post_proposal_get_suggested_texts`, method: "POST", body });

export const generate_post_proposal_get_suggested_video = async (body) =>
  request({ url: `/generate_post_proposal_get_suggested_video`, method: "POST", body });

export const get_post_in_generation = async () =>
  request({ url: `/get_post_in_generation` });

export const generate_post_schedule = async (obj) =>
  request({ url: `/generate_post_schedule`, method: "POST", body: obj });
