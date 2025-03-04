# 🌦️ Minimal Weather App

## 🌐 Live Demo
[Live Weather App](https://minimalwx.netlify.app/)
## 📄 Description
A sleek, **Dieter Rams/Braun-inspired** weather application that provides real-time weather updates using the OpenWeather API. The design emphasizes clarity, simplicity, and usability, with smooth interactions and a dark mode option.

## 🚀 Features
- 🔍 **Search any city** for real-time weather data
- 📍 **Use geolocation** to get weather for your current location
- 🌡️ **Toggle between Celsius & Fahrenheit**
- 🌙 **Dark mode support** for a better experience
- 🔄 **5-day weather forecast** with icons
- 🛠️ **Error handling:** Provides feedback for incorrect city names

## 🛠️ Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **API:** OpenWeather API
- **Hosting:** Netlify

## 📁 Project Structure
```
weather-app/
├── style.css       # Main stylesheet  
├── script.js       # JavaScript functionality  
├── index.html      # Main HTML file  
├── mist.gif        # Weather GIF  
├── snow.gif        # Weather GIF  
├── thunder.gif     # Weather GIF  
├── rain.gif        # Weather GIF  
├── clear.gif       # Weather GIF  
├── clouds.gif      # Weather GIF  

README.md           # Project documentation (outside the folder)

```
## 💡 Approach & Thought Process
### 🎨 Design Decision: Background Image
The requirement suggested using a background image that changes based on weather conditions. However, after testing, I found that **dynamic backgrounds negatively impacted text visibility and overall readability**. 

To maintain **clarity and a clean UI**, I opted for a **minimalist approach** using weather-specific GIFs and color adjustments instead. This ensures that all weather details remain easily readable across different conditions without distracting elements. 

This decision aligns with **usability best practices**, prioritizing accessibility and user experience over decorative elements.

The goal of this project was to build a **user-friendly, fast, and intuitive** weather application. My approach focused on:
- **Minimalist UI:** Inspired by Dieter Rams / Braun design philosophy, I used a clean, distraction-free layout.
- **API Integration:** Fetching live data from OpenWeather API and ensuring proper error handling.
- **Performance & Optimization:** Ensured fast loading and smooth UI interactions.
- **User Experience:** Added dark mode for better readability and geolocation support for quick access.

## 📸 Screenshots
![127 0 0 1_3000_index html (1)](https://github.com/user-attachments/assets/5375b1a5-258a-49f7-b9b5-11bf6af5aff2)

## 📌 How to Use
1. Clone this repo:
   ```sh
   git clone https://github.com/ishank000/Weather-app.git
   ```
2. Open `index.html` in your browser.

## 📬 Contact
- **Email:** sahniishank0@gmail.com
- **LinkedIn:** [Ishank Sahni](https://in.linkedin.com/in/ishank-sahni-b02517282)
- **GitHub:** [ishank000](https://github.com/ishank000)

Feel free to explore the site and reach out if you'd like to collaborate or have any questions!
