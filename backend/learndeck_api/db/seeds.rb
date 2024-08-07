# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Carddeck.create(
  contents: {
    "statistics": {
      "errorsPerRun": []
    },
    "cards": [
      {
        "front": "What is minification in web development?",
        "back": "Minification is the process of reducing the size of code files by removing unnecessary characters without changing functionality. It's commonly used to improve load times and reduce bandwidth usage.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "How does code splitting improve web application performance?",
        "back": "Code splitting allows you to divide your JavaScript bundle into smaller chunks, which can be loaded on demand or in parallel. This reduces the initial load time of the application and improves performance, especially on slower networks.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is the purpose of content hashing in file names?",
        "back": "Content hashing in file names (e.g., app.8f7e4.js) creates a unique identifier based on the file's content. This allows for efficient cache busting, ensuring that users always receive the latest version of a file when it changes.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is an IIFE and why is it used?",
        "back": "An IIFE (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined. It's often used to create a private scope for variables, avoiding polluting the global namespace.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What are polyfills and why are they important?",
        "back": "Polyfills are pieces of code that provide modern functionality on older browsers that do not natively support it. They're important for ensuring consistent behavior across different browser environments.",
        "statistics": [0, 0, 0]
      }
    ]
  },
  title: 'Modern Web Deveopment', 
  author: 'Developer', 
  description: 'Some questions about modern web development concepts')

Carddeck.create(
  contents: {
    "statistics": {
      "errorsPerRun": []
    },
    "cards": [
      {
        "front": "What is Webpack and how does it benefit web development?",
        "back": "Webpack is a module bundler for JavaScript applications. It benefits web development by managing dependencies, optimizing assets, and enabling advanced features like code splitting and hot module replacement.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "How do dynamic imports contribute to application performance?",
        "back": "Dynamic imports allow parts of a web application to be loaded on demand, rather than all at once. This can significantly improve initial load times and overall application performance, especially for large applications.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is the difference between minification and obfuscation?",
        "back": "Minification reduces code size by removing unnecessary characters, while obfuscation deliberately makes the code difficult to understand. Minification is primarily for performance, while obfuscation is for security.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "How does asynchronous module loading improve user experience?",
        "back": "Asynchronous module loading allows parts of an application to load in the background without blocking the main thread. This results in a more responsive user interface and faster perceived load times.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is the purpose of using npm in web development?",
        "back": "npm (Node Package Manager) is used to manage dependencies in JavaScript projects. It allows developers to easily install, share, and manage the external libraries and tools used in their projects.",
        "statistics": [0, 0, 0]
      }
    ]
  },
  title: 'Web Application Architecture', 
  author: 'Developer', 
  description: 'Some questions about modern web architecture')

Carddeck.create(
  contents: {
    "statistics": {
      "errorsPerRun": []
    },
    "cards": [
      {
        "front": "How does cache busting improve web application performance?",
        "back": "Cache busting ensures that users always receive the latest version of a file when it changes, while still benefiting from browser caching for unchanged files. This is often achieved through content hashing in file names.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is lazy loading and how does it benefit web applications?",
        "back": "Lazy loading is a technique where non-critical resources are loaded only when needed. This can significantly improve initial page load times and reduce unnecessary bandwidth usage, especially for media-heavy websites.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "How does modularity contribute to web application maintainability?",
        "back": "Modularity in web applications involves breaking down the codebase into smaller, independent modules. This improves maintainability by making the code easier to understand, test, and update without affecting other parts of the application.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What role does asset management play in web application performance?",
        "back": "Effective asset management involves optimizing how resources like images, scripts, and stylesheets are delivered to the browser. This includes techniques like minification, compression, and efficient loading strategies to improve overall application performance.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "How do third-party dependencies impact web application performance?",
        "back": "Third-party dependencies can significantly impact performance if not managed properly. While they can add functionality, they also increase the application's size and complexity. Careful selection and optimization of dependencies is crucial for maintaining good performance.",
        "statistics": [0, 0, 0]
      }
    ]
  },
  title: 'Web Application Performance', 
  author: 'Developer', 
  description: 'Some questions about modern web application performance')