# Products List Performance Fixes

## Issues Identified
- Filtering and mapping over the products array can be expensive for large lists.
- No memoization: the products array is recalculated and re-rendered on every parent render, even if unchanged.

## Fixes Applied
- Used `useMemo` to memoize the products array in the Products component, ensuring that the list is only recalculated when the products prop actually changes.
- Added comments to clarify the performance benefit.

## Best Practices
- For very large lists, consider using a virtualized list (e.g., `react-window`) to further optimize rendering.
- Always memoize derived data and expensive computations in React components.

---

**These changes improve UI responsiveness and scalability for large product catalogs.** 