import { Header, StatsCard, TripCard } from 'components'
import React from 'react'
import { getUser } from '~/appwrite/auth';
import { dashboardStats, user, allTrips, users} from '~/constants';
import type {Route} from "./+types/dashboard";

export const clientLoader = async () => {
  return await getUser();
}

// loaderData: user fetched from clientLoader
// Route.ComponentProps: type generated from dashboard by react-router
const Dashboard = ({loaderData}: Route.ComponentProps) => {
  const user = loaderData as User | null;
  const {totalUsers, usersJoined, totalTrips, tripsCreated, userRole} = dashboardStats;

  return (
    <main className='dashboard wrapper'>
      <Header 
        title={`Welcome ${user?.name ?? "Guest"}`}
        description="Track activity, trends and popular destinations in realtime"
      />

      <section className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <StatsCard 
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />

          <StatsCard 
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />

          <StatsCard 
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>
      
      <section className='container'>
        <h1 className='text-xl font-semibold text-dark-100'>Created Trips</h1>
        <div className='trip-grid'>
          {allTrips.slice(0,4).map(({id, name, imageUrls, itinerary, tags, estimatedPrice}) => (
            <TripCard 
              key={id}
              id={id.toString()}
              name={name}
              imageUrl={imageUrls[0]}
              location={itinerary?.[0]?.location ?? ""}
              tags={tags}
              price={estimatedPrice}
            />
          ))}
        </div>
      </section>
      
    </main>
  )
}

export default Dashboard