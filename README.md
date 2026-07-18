# Strength Path

Mobile-first guided strength training app. Progressive programs, body-part teaching, and 1,324 exercises with GIFs + step-by-step instructions.

**Data source:** [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)  
**Media:** © [Gym visual](https://gymvisual.com/) (via the dataset license/NOTICE)

## Architecture

```
src/
  app/                 # Next.js App Router pages (RWD, phone-first)
    page.tsx           # Home — path overview + body map
    path/              # Progressive strength stages
    body/              # Body-part teaching + exercise lists
    library/           # Search / filter all exercises
    exercise/[id]/    # GIF + numbered coaching steps
    workout/[id]/     # Guided session player (sets + rest)
  components/          # Shell, nav, cards, workout player
  data/exercises.json  # Slim English extract of the dataset
  lib/
    programs.ts        # Curated Foundation → Dumbbell → Barbell paths
    exercises.ts       # Query helpers
    body-parts.ts      # Body map metadata
    media.ts           # jsDelivr CDN URLs for GIFs/thumbs
```

### Product flow

1. **Foundation** (bodyweight patterns)  
2. **Dumbbell Engine** (home/gym load)  
3. **Barbell Base** (compound strength)  
Plus free exploration by body part and full library.

## Local development

```bash
npm install --ignore-scripts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

- **GitHub:** push this repo  
- **Vercel:** import the repo (Next.js defaults work)

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Static exercise JSON + CDN media (no backend required)
