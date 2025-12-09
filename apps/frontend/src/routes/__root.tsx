import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="w-full h-full overflow-hidden">
      <Outlet />
    </div>
  ),
})
