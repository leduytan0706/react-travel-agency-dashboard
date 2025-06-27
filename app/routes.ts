import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// define routes for files
export default [
    // create separate layout for admin pages
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard','routes/admin/dashboard.tsx'),
        route('users','routes/admin/all-users.tsx')
    ])
] satisfies RouteConfig;