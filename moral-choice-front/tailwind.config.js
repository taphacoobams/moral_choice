/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs pour les 7 péchés capitaux
        'sin-pride': '#9333ea',     // Orgueil - Violet royal
        'sin-envy': '#10b981',      // Envie - Vert émeraude
        'sin-wrath': '#ef4444',     // Colère - Rouge vif
        'sin-sloth': '#8b5cf6',     // Paresse - Violet lavande
        'sin-greed': '#f59e0b',     // Avarice - Or/Ambre
        'sin-gluttony': '#ec4899',  // Gourmandise - Rose/Magenta
        'sin-lust': '#f43f5e',      // Luxure - Rouge rosé
        
        // Couleurs de l'interface
        'village-dark': '#1c1917',  // Fond sombre pour le village
        'village-light': '#f5f5f4', // Texte clair
        'moral-high': '#22c55e',    // Jauge morale haute (vert)
        'moral-low': '#dc2626',     // Jauge morale basse (rouge)
      },
      fontFamily: {
        'medieval': ['Cinzel', 'serif'],
        'handwritten': ['Caveat', 'cursive'],
      }
    },
  },
  plugins: [],
}
