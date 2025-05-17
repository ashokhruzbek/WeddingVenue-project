 export const useAuth = () => {
  const token = localStorage.getItem("token");

  if (!token) return { isAuthenticated: false, role: null };

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return {
      isAuthenticated: true,
      role: decoded?.role || null,
    };
  } catch (err) {
      console.log(err);
    return { isAuthenticated: false, role: null };
    
  }
};
