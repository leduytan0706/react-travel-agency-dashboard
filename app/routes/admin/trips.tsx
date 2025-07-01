import { Header, TripCard } from 'components'
import React, { useState } from 'react'
import { useSearchParams, type LoaderFunctionArgs } from 'react-router';
import { getAllTrips } from '~/appwrite/trips';
import { parseTripData } from '~/lib/utils';
import type { Route } from './+types/trips';
import { PagerComponent } from '@syncfusion/ej2-react-grids';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const limit = 8;
  // get the current page number from URL
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const offset = (page - 1) * limit;

  const {trips, total} = await getAllTrips(limit, offset); 
  
  // if (total === 0){
  //   console.log("No trips found.");
  //   return []
  // }

  return {
    trips: trips.map(({$id, tripDetails, imageUrls}) => ({
        id: $id,
        ...parseTripData(tripDetails),
        imageUrls: imageUrls ?? []
    })),
    total
  }
};

const Trips = ({loaderData}: Route.ComponentProps) => {
  const trips = loaderData?.trips as Trip[] | [];
  const total = loaderData?.total;

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <main className='all-users wrapper'>
        <Header 
            title="Monitor Trips"
            description="View and edit AI-generated travel plans"
            ctaText="Create a trip"
            ctaUrl="/trips/create"
        />

        <section>
          <h1 className='mb-4 p-24-semibold text-dark-100'>Manage Travel Plans</h1>

          <div className='trip-grid mb-4'>
            {trips.map(({id, name, imageUrls, itinerary, interests, groupType, travelStyle, estimatedPrice}: Trip) => (
              <TripCard 
                  id={id}
                  key={id}
                  name={name}
                  location={
                      itinerary?.[0].location ?? ""
                  }
                  imageUrl={imageUrls[0]}
                  tags={[interests, travelStyle, groupType]}
                  price={estimatedPrice}
              />
            ))}
          </div>

          <PagerComponent
            totalRecordsCount={loaderData?.total}
            pageSize={8}
            currentPage={currentPage}
            click={(args) => {
              handlePageChange(args.currentPage);
            }}
            cssClass='!mb-4'
          />
        </section>
    </main>
  )
}

export default Trips