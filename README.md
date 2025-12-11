# ANANT-JAAP.
ANANT-JAAP. is an offline mantra counter built with React Native and Expo. Count jaap with a single tap, auto-convert 108 jaap to 1 mala, save progress locally, and switch between custom mantras or deity names. Simple, distraction-free UI made with love for daily bhakti.

Features
Tap-based jaap counter
Tap anywhere inside the circular counter on the home screen to increase your jaap count; when the session count reaches 108, it rolls over to 0 and adds 1 to the mala count automatically.​

Per-mantra tracking
Enter any mantra or deity name (Hindi/English/other languages) and the app creates a separate counter for it, keeping track of total malas and current session independently for each mantra.​


Autosave and full offline support
Every tap updates the in-memory state and writes it to local storage via @react-native-async-storage/async-storage, so closing the app or rebooting the phone does not lose progress.​

Previous mantras quick switch
Chips below the counter show all mantras you have ever entered; tap any name to instantly switch to that mantra and continue from its last saved session and mala counts.

History view
A top-right icon on the home screen opens a history screen (or section) where you can see all mantras with their cumulative mala counts, making it easy to review your practice over time.

Session reset without losing history
A “Reset session” option clears only the current mantra’s sessionJapa and sessionMala, leaving totalMala untouched so accidental taps do not spoil your long-term record.

Modern, devotional UI
The home screen shows a small sacred icon, mantra title, and “Divine Counter” subtitle, with a center circular counter inspired by popular japa apps, plus a bottom bar to enter or update your mantra text.
