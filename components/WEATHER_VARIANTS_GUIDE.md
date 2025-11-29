# 🌈 Guide des Variantes du Widget Météo

## Vue d'ensemble

Le widget météo propose **3 variantes créatives** d'intégration, chacune avec un style et une approche UX différents.

---

## 🎨 Variante 1 : Compact (Minimaliste)

**Style** : Épuré, discret, badge intégré  
**Palette** : Fond semi-transparent, texte contrasté  
**Forme** : Badge arrondi compact  
**Position** : Intégré dans la barre d'actions

### Caractéristiques
- ✅ Très discret, ne prend pas de place
- ✅ S'intègre naturellement dans la barre d'actions
- ✅ Parfait pour les écrans avec peu d'espace
- ✅ Affichage minimal : icône + température + ville

### Utilisation
```tsx
<WeatherWidget compact={true} />
```

### Design
```
┌─────────────────┐
│ ☀️ 22°         │
│    Paris        │
└─────────────────┘
```

---

## 💎 Variante 2 : Glassmorphism (Moderne)

**Style** : Glassmorphism, flottant, animation parallaxe  
**Palette** : Fond blur, bordure subtile, accent coloré  
**Forme** : Carte flottante avec effet glass  
**Position** : Flottant en haut à gauche avec parallaxe

### Caractéristiques
- ✅ Effet glassmorphism moderne
- ✅ Animation parallaxe lors du scroll
- ✅ Opacité dynamique selon la position
- ✅ Affichage complet : météo + détails

### Utilisation
```tsx
<WeatherWidget compact={false} />
// ou simplement
<WeatherWidget />
```

### Design
```
┌─────────────────────┐
│ ☀️  22°            │
│     Ensoleillé      │
│                     │
│ 📍 Paris            │
│ 💧 45% • 💨 12 km/h│
└─────────────────────┘
```

---

## 🎭 Variante 3 : Premium (Gradient Dynamique)

**Style** : Intégré au header avec gradient basé sur la météo  
**Palette** : Gradient dynamique selon la météo  
**Forme** : Intégré au fond du header avec overlay  
**Position** : Partie intégrante du header

### Caractéristiques
- ✅ Gradient dynamique selon la météo
- ✅ Couleurs adaptatives (soleil = bleu/orange, pluie = violet)
- ✅ Style premium et artistique
- ✅ Transition de couleur fluide

### Utilisation
```tsx
import { WeatherWidgetVariant } from './WeatherWidgetVariants';

<WeatherWidgetVariant variant="premium" />
```

### Design
```
┌─────────────────────┐
│ ☀️  22°            │  ← Gradient bleu/orange
│     Ensoleillé      │
│                     │
│ 📍 Paris            │
│ 💧 45% • 💨 12 km/h│
└─────────────────────┘
```

### Palettes de gradients
- ☀️ **Soleil** : `#FFD89B` → `#19547B` (Orange → Bleu ciel)
- 🌧️ **Pluie** : `#667EEA` → `#764BA2` (Violet → Violet foncé)
- ⛈️ **Orage** : `#4A5568` → `#2D3748` (Gris foncé)
- ☁️ **Nuage** : `#B2B2B2` → `#6C7A89` (Gris)
- ❄️ **Neige** : `#E0F2FE` → `#B3E5FC` (Bleu clair)

---

## 🚀 Installation pour Variante Premium

Pour utiliser la variante Premium avec gradient, installez `expo-linear-gradient` :

```bash
npx expo install expo-linear-gradient
```

---

## 📊 Comparaison des Variantes

| Critère | Compact | Glassmorphism | Premium |
|---------|---------|--------------|---------|
| **Visibilité** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Espace** | Minimal | Moyen | Grand |
| **Animation** | Aucune | Parallaxe | Gradient |
| **Style** | Minimaliste | Moderne | Artistique |
| **Performance** | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ |

---

## 💡 Recommandations d'usage

- **Compact** : Pour les écrans denses, applications minimalistes
- **Glassmorphism** : Pour un look moderne et professionnel (recommandé par défaut)
- **Premium** : Pour des applications premium, expérience utilisateur immersive

---

## 🎯 Implémentation actuelle

La variante **Glassmorphism** est actuellement implémentée par défaut dans `ParallaxScrollView.tsx` avec :
- Animation parallaxe fluide
- Opacité dynamique lors du scroll
- Style glassmorphism avec bordure subtile
- Positionnement flottant en haut à gauche

