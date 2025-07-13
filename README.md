# Rick and Morty Universe Explorer 🛸

A modern, interactive React application that lets you explore the vast Rick and Morty universe! Built with React 19 and featuring a stunning portal-themed UI with advanced animations and theme customization.

## ✨ Features

### 🎭 Character Exploration
- **Character Browser**: Browse through 800+ characters with pagination
- **Enhanced Character Cards**: Beautiful animated cards with hover effects and character quotes
- **Character Details**: View detailed information including status, species, location, and episodes
- **Search & Filter**: Find characters by name or filter by status (Alive, Dead, Unknown)

### 📺 Episode Guide
- **Complete Episode List**: All 51 episodes across 6 seasons
- **3x3 Grid Layout**: Optimized viewing with 9 episodes per page
- **Season Navigation**: Filter episodes by season or view all seasons
- **Episode Details**: View episode information and featured characters
- **Character Appearances**: See which characters appear in each episode

### 🌍 Location Discovery
- **Location Browser**: Explore 100+ locations from the multiverse
- **Location Details**: View residents and episode appearances
- **Interactive Modals**: Detailed information with character galleries
- **Search Functionality**: Find locations by name or type

### 🎨 Visual & UX Enhancements
- **Theme Customization**: Dark/Light mode toggle
- **Character Themes**: Special themes for Rick, Morty, and other characters
- **Portal Effects**: Animated portal backgrounds with intensity controls
- **Parallax Scrolling**: Smooth scrolling effects on the homepage
- **Responsive Design**: Optimized for all device sizes
- **Advanced Animations**: Smooth transitions and hover effects

## 🚀 Technology Stack

- **React 19.1.0**: Latest React with functional components and hooks
- **React Router DOM 7.6.3**: Client-side routing and navigation
- **Rick and Morty API**: Real-time data from the official API
- **CSS Grid & Flexbox**: Modern layout techniques
- **Context API**: Global state management for themes
- **Local Storage**: Theme persistence across sessions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rick-and-morty-universe.git
   cd rick-and-morty-universe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: This is a one-way operation!** Ejects from Create React App.

## 🌟 Key Components

### Pages
- **HomePage**: Landing page with featured characters and parallax effects
- **CharactersPage**: Character browser with search and pagination
- **EpisodesPage**: Episode guide with 3x3 grid layout
- **LocationsPage**: Location explorer with detailed information

### Components
- **CharacterCardEnhanced**: Animated character cards with quotes and effects
- **Navigation**: Responsive navigation with theme toggle
- **ThemeSettings**: Advanced theme customization panel
- **ThemeContext**: Global theme management

## 🎨 Theme System

The app features a comprehensive theme system with:

- **Light/Dark Modes**: Toggle between light and dark themes
- **Character Themes**: Special themes for main characters
- **Portal Effects**: Adjustable portal animation intensity
- **Persistent Settings**: Themes saved to localStorage

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for tablets
- **Desktop Experience**: Full-featured desktop interface
- **Cross-Browser**: Compatible with all modern browsers

## 🔧 API Integration

The app integrates with the [Rick and Morty API](https://rickandmortyapi.com/) to fetch:
- Character data (826 characters)
- Episode information (51 episodes)
- Location details (126 locations)

## 🚀 Deployment

The app is ready for deployment on:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the build folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- [Rick and Morty API](https://rickandmortyapi.com/) for providing the data
- [Create React App](https://github.com/facebook/create-react-app) for the initial setup
- Adult Swim for creating the amazing Rick and Morty universe

## 🐛 Known Issues

- Some character quotes are placeholder text and can be expanded
- Loading states could be enhanced with skeleton screens
- Search functionality could include more advanced filters

## 🔮 Future Enhancements

- **Favorites System**: Save favorite characters and episodes
- **Character Relationships**: Explore character connections
- **Episode Recommendations**: Suggest similar episodes
- **Advanced Search**: Multi-criteria search functionality
- **User Profiles**: Personalized experience with preferences
- **Offline Support**: Progressive Web App features

---

**Made with ❤️ and lots of ⚡ by [Your Name]**

*Wubba lubba dub dub!* 🛸

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
