---
"@usva-ui/react": patch
---

SulaNav: let the settle bounce ease into its budget instead of stopping dead on it.

A part close enough to the bar to hold a bridge may only overshoot as far as the
bridge has slack left, and that cap was applied by clamping. The pill hit the limit
at full speed and sat motionless on it for the rest of the settle, which reads as a
wall rather than a spring. The cap is now approached asymptotically, so the turn
decelerates and the bridge is protected exactly as before. Parts resting beyond the
bridge's reach, satellites among them, are unchanged.
