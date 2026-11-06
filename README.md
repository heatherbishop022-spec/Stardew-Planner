# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Stardew Valley Planner

A farm-planning web app with two completely separate sides:

- **Game Life**: you pick the in-game season, weather and luck, and the planner shows what is catchable, plantable and forageable, plus the season's birthdays and festivals.
- **Real Life**: the same tools driven by your real date and live local weather, plus real-world holidays.

Each side has its own to-do list and calendar, so game plans and real-life plans never mix.

**Live site:** https://stardew-planner-dun.vercel.app/
**Wireframe:** see the course submission (React component tree)

## Features

- **Fish, Crops and Forage tabs.** Filtered by season (and by weather for fish). Items needed for a Community Center bundle are tagged, and hovering the tag shows which bundle(s).
- **Game calendar.** A 28-day season grid with villager birthdays (with portraits), festivals and your dated game tasks.
- **Real calendar.** Month-by-month view with US public holidays and your dated tasks. Tasks can repeat every year (handy for friends' birthdays).
- **To-do lists.** One per world. Priorities, sorting, editing (including dates), completing, and deleting. Tasks save in the browser, so they are still there when you come back. Clicking a task in a calendar jumps to it in the list.
- **Luck and tips.** A luck setting with a matching tip, plus the Livin' Off The Land tips for the selected season.
- **Live background.** The pixel-art scenery follows real sunrise and sunset at your location and shows the real weather (clouds, rain, storms, snow, fog). Panels are tinted for the season.
- **Responsive.** Panels stack on narrow screens, and each panel can be collapsed.

## APIs used

| API | What it provides | Key needed |
| --- | --- | --- |
| [Open-Meteo](https://open-meteo.com) | Current weather, temperature, sunrise and sunset | No |
| [Stardew Valley Wiki](https://stardewvalleywiki.com) (MediaWiki API) | Fish, crops, forage, villager birthdays and portraits | No |
| [Nager.Date](https://date.nager.at) | Public holidays | No |

Weather and sun times use the browser's location when allowed, and fall back to a default location when it is not. Wiki pages are fetched through the MediaWiki `action=parse` API and read with the browser's `DOMParser`.

## Tech

React (Vite, JavaScript), hooks (`useState`, `useEffect`, `useRef` and custom hooks), `localStorage`, plain CSS with CSS variables. Deployed on Vercel.

## Component structure

```
App
├── Scenery                  (SVG background, driven by useDaylight)
├── GamePanel                (you choose season / weather / luck)
│   └── Panel
│       └── StardewInfo      (tabs)
│           ├── FishList · CropList · ForageList   → Card
│           ├── GameCalendar → CalendarGrid
│           └── TaskPanel    → TaskForm, TaskItem
├── RealPanel                (live weather and real date)
│   └── Panel
│       └── StardewInfo
│           ├── FishList · CropList · ForageList   → Card
│           ├── RealCalendar → CalendarGrid
│           └── TaskPanel    → TaskForm, TaskItem
└── Footer
```

```
src/
├── api/         wiki.js (fish, crops, forage, birthdays), holidays.js
├── components/  panels, tabs, lists, calendars, tasks, scenery, footer
├── hooks/       useTasks, useHolidays, useForage, useDaylight
├── utils/       stardew.js (filters, luck, festivals), dates.js
├── data/        tips.json (Livin' Off The Land tips)
└── index.css    all styles
```

## Run it locally

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Notes and limitations

- Real seasons use the Northern Hemisphere calendar (Dec-Feb is Winter, and so on) when mapping the real date to a Stardew season.
- A few multi-season crops (Ancient Fruit, Cactus Fruit, Coffee Bean, Corn, Fiber, Qi Fruit, Sunflower, Tea Leaves, Wheat) are not laid out in the wiki's per-season tables, so their seasons are listed by hand in `wiki.js`.
- Festival names and dates are written into `stardew.js` rather than read from the wiki.
- Ginger Island fish and forage tables are not included in the forage tab; Ginger Island fish can be toggled on in the Fish tab.
- Wiki data is loaded when the page opens, so the app needs an internet connection. If the wiki is unreachable, the affected tab shows an error message.
- Tasks are stored only in your own browser, so they do not sync between devices.

## Credits

Stardew Valley is created by [ConcernedApe](https://www.stardewvalley.net). This is an unofficial fan project and is not affiliated with or endorsed by ConcernedApe. Game information and villager portraits come from the [Stardew Valley Wiki](https://stardewvalleywiki.com). Live weather and sun times by [Open-Meteo.com](https://open-meteo.com), holidays from [Nager.Date](https://date.nager.at), and the pixel font is [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans). The background scenery is drawn for this project.