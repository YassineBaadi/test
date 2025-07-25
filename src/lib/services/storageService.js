import fs from "fs";
import path from "path";

// In-memory storage for Vercel deployment
let memoryStorage = {
  cart: [],
  users: [],
};

// Try to load from file, fallback to memory
function loadData(type) {
  try {
    if (process.env.NODE_ENV === "production") {
      // In production (Vercel), use memory storage
      return memoryStorage[type] || [];
    }

    // In development, try to read from file
    const filePath = path.join(process.cwd(), `${type}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading ${type} data:`, error);
  }
  return [];
}

// Try to save to file, fallback to memory
function saveData(type, data) {
  try {
    if (process.env.NODE_ENV === "production") {
      // In production (Vercel), use memory storage
      memoryStorage[type] = data;
      return true;
    }

    // In development, try to write to file
    const filePath = path.join(process.cwd(), `${type}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${type} data:`, error);
    // Fallback to memory storage
    memoryStorage[type] = data;
    return false;
  }
}

export const storageService = {
  loadCart: () => loadData("cart"),
  saveCart: (data) => saveData("cart", data),
  loadUsers: () => loadData("users"),
  saveUsers: (data) => saveData("users", data),
};
