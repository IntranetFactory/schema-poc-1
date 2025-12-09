import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Outlet />
    </div>
  ),
})
