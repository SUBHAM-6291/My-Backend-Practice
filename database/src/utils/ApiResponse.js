// API Response ka ek custom class banaya jo API ke responses ko standardized karega
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status code set kar rahe hain
        this.data = data; // API se jo bhi data aayega, yahan store hoga
        this.message = message; // Default success message rakha hai
        
        // Agar statusCode 400 se chhota hai toh success true hoga, warna false
        this.success = statusCode < 400;
    }
}

// Isko import karke API responses standardized bana sakte ho
export { ApiResponse };
