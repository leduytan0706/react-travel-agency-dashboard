import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

// define routes for files
export default [
    route('sign-in','routes/root/sign-in.tsx'),
    route('api/create-trip', 'routes/api/create-trip.ts'),
    // create separate layout for admin pages
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard','routes/admin/dashboard.tsx'),
        route('users','routes/admin/users.tsx'),
        route('trips','routes/admin/trips.tsx'),
        route('trips/create','routes/admin/create-trip.tsx')
    ])
] satisfies RouteConfig;