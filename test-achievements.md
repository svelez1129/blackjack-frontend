# Achievement System Testing Guide

The development server is running at: **http://localhost:3001**

## 🧪 Testing Checklist

### 1. **Basic Achievement Flow**
- [ ] Open http://localhost:3001
- [ ] Click "PLAY FREE BLACKJACK NOW" 
- [ ] Look for achievements button (🏆) in top-left
- [ ] Should show "0/20" initially (or similar)

### 2. **First Achievement: "Welcome to the Table"**
- [ ] Place any bet (click a chip: $10, $25, $50, or $100)
- [ ] **Expected**: Achievement notification should appear immediately
- [ ] **Should show**: "Welcome to the Table - Play your first hand of blackjack"
- [ ] **Reward**: +50 coins added to balance
- [ ] **Achievement button**: Should now show "1/20" with notification dot

### 3. **Action-Based Achievements**
- [ ] Try hitting (should get "Double or Nothing" if you double)
- [ ] Try doubling down (should get "Double or Nothing" achievement)  
- [ ] Try splitting if you get a pair (should get "Split Decision" achievement)

### 4. **Achievement Modal**
- [ ] Click the 🏆 button in top-left
- [ ] **Expected**: Modal opens showing all achievements
- [ ] **Should see**: Categories (Getting Started, Milestones, etc.)
- [ ] **Should see**: Completed achievements with green checkmarks
- [ ] **Should see**: Progress bars for incomplete achievements
- [ ] **Should see**: Your completion percentage at top

### 5. **Win Streak Achievement**
- [ ] Try to win 3 hands in a row
- [ ] **Expected**: "Hot Streak" achievement unlocks
- [ ] **Should show**: Fire emoji 🔥 notification

### 6. **Data Persistence**
- [ ] Unlock a few achievements
- [ ] Refresh the page (F5)
- [ ] **Expected**: Achievements should persist
- [ ] **Expected**: Achievement button should show correct count
- [ ] **Expected**: Modal should show same progress

### 7. **Achievement Notifications**
- [ ] Notifications should auto-dismiss after 4 seconds
- [ ] Can manually close with X button
- [ ] Different rarity achievements should have different colors
- [ ] Epic achievements should have confetti effects

### 8. **Edge Cases**
- [ ] Open browser dev tools (F12) → Console
- [ ] Should see no error messages
- [ ] Play several hands to test milestone tracking
- [ ] Try getting blackjack (should unlock "Natural!" achievement)

## 🐛 What to Look For

### ✅ **Working Correctly:**
- Achievement notifications appear immediately after actions
- Coin rewards are added to balance
- Progress persists after page reload
- Modal opens/closes smoothly
- Achievement button updates count

### ❌ **Potential Issues:**
- No notification appears after first bet
- Achievement modal doesn't open
- Console errors in browser dev tools
- Progress resets after page reload
- Notifications don't auto-dismiss

## 📊 **Testing Results**

After testing, note:
- Which achievements unlocked successfully: ________________
- Any error messages in console: ________________  
- Performance issues: ________________
- UI/UX feedback: ________________

## 🔧 **Quick Debugging**

If something doesn't work:

1. **Check Browser Console** (F12 → Console tab)
2. **Check localStorage** (F12 → Application tab → Local Storage)
   - Should see keys like `achievements_progress` and `game_statistics`
3. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)

## 🎯 **Success Criteria**

The system passes testing if:
- [x] At least 3 different achievements can be unlocked
- [x] Notifications appear and display correctly  
- [x] Achievement modal shows progress accurately
- [x] Data persists after page reload
- [x] No console errors during normal gameplay