import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// define routes for files
export default [
    route('sign-in','routes/root/sign-in.tsx'),
    // create separate layout for admin pages
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard','routes/admin/dashboard.tsx'),
        route('users','routes/admin/users.tsx')
    ])
] satisfies RouteConfig;