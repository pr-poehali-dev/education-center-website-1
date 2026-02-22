const AUTH_URL = "https://functions.poehali.dev/ac68c96a-4b48-4841-afdd-c45fec1a7ad5";
const ADMIN_URL = "https://functions.poehali.dev/a30f8752-d13c-41eb-99b2-d8709193a333";

export function getToken(): string {
  return localStorage.getItem("adminToken") || "";
}

export function setToken(token: string) {
  localStorage.setItem("adminToken", token);
}

export function clearToken() {
  localStorage.removeItem("adminToken");
}

export async function login(username: string, password: string) {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

async function checkResponse(res: Response): Promise<unknown> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchEntity(entity: string) {
  const res = await fetch(`${ADMIN_URL}?entity=${entity}`, {
    headers: { "X-Auth-Token": getToken() },
  });
  return checkResponse(res);
}

export async function createEntity(entity: string, data: Record<string, unknown>) {
  const res = await fetch(`${ADMIN_URL}?entity=${entity}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": getToken(),
    },
    body: JSON.stringify(data),
  });
  return checkResponse(res);
}

export async function updateEntity(entity: string, id: number, data: Record<string, unknown>) {
  const res = await fetch(`${ADMIN_URL}?entity=${entity}&id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": getToken(),
    },
    body: JSON.stringify(data),
  });
  return checkResponse(res);
}

export async function deleteEntity(entity: string, id: number) {
  const res = await fetch(`${ADMIN_URL}?entity=${entity}&id=${id}`, {
    method: "DELETE",
    headers: { "X-Auth-Token": getToken() },
  });
  return checkResponse(res);
}

export default { login, fetchEntity, createEntity, updateEntity, deleteEntity, getToken, setToken, clearToken };