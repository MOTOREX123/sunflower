# Sunflower Surprise 🌻

A romantic interactive mobile-first website experience for someone special.

## 🌟 Features

- **5 Beautiful Scenes** with smooth animations
- **Mobile-First Design** - optimized for phone screens
- **Sunflower Theme** - seed grows, stem extends, leaves appear, flower blooms
- **Personal Messages** - easily customizable
- **Cute Code Moment** - `while True: me.love(you)` with blinking cursor
- **Animated Sunflower Garden** - swaying flowers, stars, moon, floating particles
- **Optional Music** - add your own audio file
- **No Dependencies** - pure HTML, CSS, JavaScript
- **Works Offline** - runs locally without internet
- **Respects `prefers-reduced-motion`**

## 🚀 Quick Start (Windows)

```powershell
cd sunflower
python -m http.server 8000
```

Then open: **http://localhost:8000**

## 📱 Test on Your Phone

1. Find your computer's IP: `ipconfig` (look for IPv4 Address)
2. On your phone, open: `http://YOUR_IP:8000`
3. Both devices must be on the same WiFi

## ✏️ Customize Your Messages

Edit `script.js` - all text is in the **CONFIG** object at the top:

```javascript
const CONFIG = {
    opening: {
        line1: "Hey you... 🌻",
        line2: "I made something for you.",
        buttonText: "Open it ❤️"
    },
    sunflower: {
        message1: "Because you deserve something that always turns toward the light. 🌻",
        message2: "Just like I always find my way back to you."
    },
    personal: {
        lines: [
            "Somehow, in this huge world...",
            "I found you. ❤️",
            "And honestly...",
            "And I don't want to imagine my days without you."
        ]
    },
    code: {
        outputText: "Running forever. ❤️"
    },
    garden: {
        messages: [
            "If I could give you one thing...",
            "I'd give you a sunflower.",
            "But since I can't hand you one right now...",
            "I made you a little garden instead. 🌻"
        ]
    },
    final: {
        messages: [
            "You're my favorite person.",
            "Happy to have you in my life. ❤️"
        ],
        signature: {
            line: "Always yours,",
            name: "— Your favorite coder 💻🌻"
        }
    }
};
```

## 🎵 Add Music

1. Add an MP3 file named `music.mp3` to the project folder
2. Or edit `CONFIG.global.musicFile` in `script.js` to point to your file
3. Music is **muted by default** - she taps the ♪ button to play

## 🌐 Free Deployment

### GitHub Pages (Recommended)
1. Create a GitHub repo
2. Push these files
3. Settings → Pages → Deploy from branch → `main` / `root`
4. Your site: `https://YOUR_USERNAME.github.io/REPO_NAME`

### Netlify (Drag & Drop)
1. Go to [netlify.com](https://netlify.com)
2. Drag the `sunflower` folder to the deploy area
3. Get instant URL like `https://random-name.netlify.app`

### Vercel
```bash
npm i -g vercel
vercel
```
Follow prompts → get `https://project.vercel.app`

## 📁 Project Structure

```
sunflower/
├── index.html      # Main HTML with all 5 scenes
├── style.css       # All styling & animations
├── script.js       # Scene logic + CONFIG (edit messages here)
├── music.mp3       # Optional: add your own music file
└── README.md       # This file
```

## 🎮 Controls

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Next scene |
| `→` / `←` | Next / Previous scene |
| `M` | Toggle music |
| `R` | Restart experience |

## 🔧 Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 📝 License

MIT - Feel free to use and modify for your own romantic surprises!

---

**Made with 💻🌻 for someone special**