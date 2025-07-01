import React from 'react'
import type { LoaderFunctionArgs } from 'react-router';
import { getAllTrips, getTripById } from '~/appwrite/trips';
import type { Route } from './+types/trip-details';
import { cn, getFirstWord, parseTripData } from '~/lib/utils';
import { Header, InfoPill, TripCard } from 'components';
import { ChipDirective, ChipListComponent, ChipsDirective } from '@syncfusion/ej2-react-buttons';
import { allTrips } from '~/constants';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    // get the tripId param from URL parameters
    const { tripId } = params;

    if (!tripId){
        throw new Error('Trip ID is required.');
    }

    const [trip, {trips}] = await Promise.all([
        await getTripById(tripId),
        await getAllTrips(4, 0)
    ]);
    
    return {
        allTrips: trips.map(({$id, tripDetails, imageUrls}) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? []
        })),
        trip
    }
};

const TripDetails = ({loaderData}: Route.ComponentProps) => {
    // parse the trip data
    const tripData = parseTripData(loaderData?.trip?.tripDetails);
    const imageUrls = loaderData?.trip?.imageUrls || [];

    const { 
        name, duration, itinerary, travelStyle, 
        groupType, budget, interests, estimatedPrice, 
        description, bestTimeToVisit, weatherInfo, 
        country 
    } = tripData || {};

    const allTrips = loaderData?.allTrips as Trip[] | [];

    const chipItems = [
        { text: groupType, bg: '!bg-blue-100 !text-blue-500' },
        { text: travelStyle, bg: '!bg-pink-100 !text-pink-500' },
        { text: interests, bg: '!bg-yellow-200 !text-yellow-600' },
        { text: budget, bg: '!bg-green-200 !text-green-700' },
    ];

    const visitTimeAndWeatherInfo = [
        { title: "Best Time to Visit", items: bestTimeToVisit },
        { title: "Weather Forecast", items: weatherInfo}
    ];

  return (
    <main className='travel-detail wrapper'>
        <Header 
            title='Trip Details'
            description='View and edit AI-generated travel plans.'
        />

        <section className='container wrapper-md'>
            <header>
                <h1 className='p-40-semibold text-dark-100'>
                    {name}
                </h1>

                <div className='flex flex-col !items-start gap-5'>
                    <InfoPill 
                        text={`${duration}-day plan`}
                        image="/assets/icons/calendar.svg"
                    />

                    <InfoPill 
                        text={[...(itinerary?.slice(0,5)
                            .reduce((acc, item) => acc.add(item.location), new Set<string>())) || ""]
                            .join(', ')}
                        image="/assets/icons/location-mark.svg"
                    />
                </div>
            </header>

            <section className='gallery'>
                {imageUrls.map((url: string, index: number) => (
                    <img 
                        src={url} 
                        alt={name}
                        key={index}
                        className={cn('w-full rounded-xl object-cover',
                            index === 0? 'md:col-span-2 md:row-span-2 h-[330px]': 'md:row-span-1 h-[150px]'
                        )} 
                    />
                ))}
            </section>

            <section className='flex gap-3 md:gap-5 items-center justify-between flex-wrap'>
                <ChipListComponent>
                    <ChipsDirective>
                        {chipItems.map((item, index) => (
                            <ChipDirective
                                key={index}
                                text={getFirstWord(item.text)}
                                cssClass={`${item.bg} !text-base !font-medium !px-4 !text-[13px]`}
                            />
                        ))}
                    </ChipsDirective>
                </ChipListComponent>

                <ul className='flex gap-1 items-center'>
                    {Array(5).fill('null').map((_, index) => (
                        <li key={index}>
                            <img 
                                src="/assets/icons/star.svg" 
                                alt="star" 
                                className='size-[18px]'
                            />
                        </li>
                    ))}
                    <li className='ml-1'>
                        <ChipListComponent>
                            <ChipsDirective>
                                <ChipDirective
                                    text="4.9/5"
                                    cssClass='!bg-indigo-100 !text-indigo-500'
                                />
                            </ChipsDirective>
                        </ChipListComponent>
                    </li>
                </ul>
            </section>

            <section className='title'>
                <article>
                    <h3>
                        {duration}-Day {country} {travelStyle}
                    </h3>
                    <p>{budget}, {groupType} and {interests}</p>
                </article> 

                <h2>{estimatedPrice}</h2>
            </section>

            <p className='text-sm md:text-lg font-normal text-dark-400'>{description}</p>
            
            <ul className='itinerary'>
                {itinerary?.map((dayPlan: DayPlan, index: number) => (
                    <li
                        key={index}
                    >
                        <h3>Day {dayPlan.day}: {dayPlan.location}</h3>
                        <ul>
                            {dayPlan.activities.map((activity, index: number) => (
                                <li 
                                    key={index}
                                >
                                    <span className='flex-shrink-0 p-18-semibold'>{activity.time}</span>
                                    <p className='flex-grow'>{activity.description}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            {visitTimeAndWeatherInfo.map((info) => (
                <section
                    key={info.title}
                    className='visit'
                >
                    <h3>{info.title}</h3>
                    <ul>
                        {info.items?.map((item, index) => (
                            <li key={index}>
                                <p className='flex-grow'>{item}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </section>

        <section className='flex flex-col gap-6'>
            <h2 className='p-24-semibold text-dark-100'>Popular Trips</h2>
            <div className='trip-grid'>
                {allTrips.map(({id, name, imageUrls, itinerary, interests, groupType, travelStyle, estimatedPrice}: Trip) => (
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
        </section>
    </main>
  )
}

export default TripDetails