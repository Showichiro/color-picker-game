# Refactor: Remove Global State and Unsafe Casts

## Objectives
1. Remove global mutable state (`panelIdCounter`) from game.ts
2. Replace unsafe type casts (`as RGB`, `as HexColor`) with safe Result-returning functions

## Technical Details

### Global State Issue
- Current: `let panelIdCounter = 0` in game.ts
- Solution: Introduce IdGenerator pattern to encapsulate state

### Unsafe Casts Issues
- `generateRandomRGB()` uses `as RGB` without validation
- `generateSimilarColor()` uses `as RGB` without validation  
- `rgbToHex()` uses `as HexColor` without validation

## Implementation Plan
1. Create IdGenerator type and factory
2. Update all functions that create panels to accept IdGenerator
3. Modify RGB generation functions to return Result types
4. Update hex conversion to use Result type
5. Update all consumers to handle Result types properly

## Test Strategy
- Verify IdGenerator produces unique sequential IDs
- Ensure RGB generation always returns valid values
- Test error handling for invalid color operations