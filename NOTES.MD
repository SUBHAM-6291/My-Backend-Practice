# Project Notes

## Root Folder

Yeh project ka root folder hai. Isme configuration files aur main entry point hota hai.

### Files

- **.gitignore**: Git ko batata hai kaunse files aur directories ignore karne hain.
- **.prettierignore**: Prettier ko batata hai kaunse files aur directories ignore karne hain.
- **.prettierrc**: Prettier ke liye configuration file.
- **package.json**: Project ke baare mein metadata aur dependencies ko rakhta hai.

## `src` Folder

Yeh folder application ka main source code rakhta hai, jisme configuration files, controllers, models, routes, aur utilities shamil hain.

### Files

- **.env**: Environment variables file.
- **app.js**: Main application file jahan middleware aur routes set up hote hain.
- **constants.js**: Application mein use hone wale constants ko rakhta hai.

## `controllers` Folder

Yeh folder controller files rakhta hai jo different routes ke liye business logic handle karte hain.

### Files

- **User.Controller.js**: User-related operations jaise registration, login, logout, aur profile management ka logic rakhta hai.

## `Db` Folder

Yeh folder database connection logic rakhta hai.

### Files

- **index.js**: Mongoose ka use karke MongoDB database se connection establish karta hai.

## `middlewares` Folder

Yeh folder middleware functions rakhta hai jo requests ko controllers tak pahunchne se pehle process karte hain.

### Files

- **Auth.middleware.js**: JWT tokens verify karne ke liye middleware.
- **Multer.middleware.js**: File uploads handle karne ke liye middleware.

## `models` Folder

Yeh folder Mongoose models rakhta hai jo MongoDB database mein data ka structure define karte hain.

### Files

- **Subscription.Model.js**: Subscriptions ke liye schema define karta hai.
- **User.Model.js**: Users ke liye schema define karta hai.
- **video.Models.js**: Videos ke liye schema define karta hai.

## `routes` Folder

Yeh folder application ke routes definitions rakhta hai.

### Files

- **User.Routes.js**: User-related operations ke liye routes define karta hai.

## `Service` Folder

Yeh folder external services handle karne wale service files rakhta hai.

### Files

- **Cloudinary.js**: Cloudinary par files upload karne ke functions rakhta hai.

## `uploads` Folder

Yeh folder temporarily uploaded files ko store karne ke liye use hota hai.

### Files

- **.gitkeep**: Ensure karta hai ki folder Git dwara track ho, chahe yeh khali ho.
- **temp/**: Temporary files ke liye subfolder.

## `utils` Folder

Yeh folder utility functions aur classes rakhta hai jo application mein use hote hain.

### Files

- **ApiError.js**: API errors handle karne ke liye custom error class.
- **ApiResponse.js**: API responses ko standardize karne ke liye custom response class.
- **asynchandler.js**: Asynchronous operations handle karne ke liye utility function.

## `Main/backend` Folder

Yeh folder main application ke backend setup ko rakhta hai.

### Files

- **index.js**: Backend server ke liye main entry point.
- **package.json**: Backend project ke baare mein metadata aur dependencies ko rakhta hai.

## `Main/backend/prof-backend` Folder

Yeh folder main application ke professional backend setup ko rakhta hai.

### Files

- **package.json**: Professional backend project ke baare mein metadata aur dependencies ko rakhta hai.
- **.prettierignore**: Prettier ko batata hai kaunse files aur directories ignore karne hain.
- **.prettierrc**: Prettier ke liye configuration file.
- **.gitignore**: Git ko batata hai kaunse files aur directories ignore karne hain.
- **src/**: Source files ke liye subfolder.

## `Main/backend/prof-backend/src` Folder

Yeh folder professional backend setup ke source files rakhta hai.

### Files

- **index.js**: Professional backend server ke liye main entry point.
- **app.js**: Main application file jahan middleware aur routes set up hote hain.
- **constants.js**: Application mein use hone wale constants ko rakhta hai.

## `README.md` File

Yeh file project ka description aur project ko set up aur run karne ke instructions rakhti hai.

## `MYnotes1-import-server` File

Yeh file Axios aur doosre related topics ke notes rakhti hai.

## `Mynotes-2-everything` File

Yeh file CORS, MongoDB, aur doosre related topics ke notes rakhti hai.

## `NPM packages` File

### NPM Packages to Install

1. **express**: Node.js ke liye ek web framework jo web applications aur APIs banane ke kaam aata hai.
2. **mongoose**: MongoDB aur Node.js ke liye ek ODM (Object Data Modeling) library.
3. **jsonwebtoken**: JWT (JSON Web Tokens) ko handle karne ke liye.
4. **bcryptjs**: Passwords ko securely store karne ke liye hash karta hai.
5. **cookie-parser**: Client request object ke sath attached cookies ko parse karta hai.
6. **dotenv**: `.env` file se environment variables ko `process.env` mein load karta hai.
7. **multer**: Multipart/form-data ko handle karta hai, jo primarily file uploads ke liye use hota hai.
8. **cloudinary**: Cloudinary par images upload karne ke liye.
9. **express-async-handler**: Async express routes ke andar exceptions handle karta hai aur unhe express error handlers ko pass karta hai.
10. **cors**: Cross-Origin Resource Sharing (CORS) ko enable karta hai.

### Development Dependencies

1. **nodemon**: Server ko automatically restart karta hai jab directory mein file changes detect hote hain.