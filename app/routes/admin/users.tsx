import { Header } from 'components'
import React from 'react'
import {ColumnDirective, ColumnsDirective, GridComponent} from "@syncfusion/ej2-react-grids";
import { users } from '~/constants';
import { cn, formatDate } from '~/lib/utils';
import { getAllUsers } from '~/appwrite/auth';
import type { Route } from './+types/users';
import { spanToBaggageHeader } from '@sentry/react-router';

export const loader = async () => {
  const {users, total} = await getAllUsers(10, 0);

  return {users, total};
}

const Users = ({loaderData}: Route.ComponentProps) => {
  const {users} = loaderData;

  return (
    <main className='all-users wrapper'>
      <Header 
        title="Manage users"
        description="Filter, sort, annd access detailed user profiles."
      />

      <GridComponent dataSource={users} gridLines='None'>
        <ColumnsDirective>
          <ColumnDirective
            field="name" 
            headerText="Name" 
            width="200"
            textAlign="Left"
            // define how data here is displayed
            // callback function that takes in the user data as type UserData
            template={(props: UserData) => (
              <div className='flex items-center gap-1.5'>
                <img 
                  src={props.imageUrl} 
                  alt="user"
                  className='rounded-full size-8 aspect-square' 
                  referrerPolicy='no-referrer'
                />
                <span>{props.name}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="email" 
            headerText="Email Address" 
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt" 
            headerText="Joined At" 
            width="150"
            textAlign="Left"
            template={({joinedAt}: UserData) => (
              <span>{formatDate(joinedAt)}</span>
            )}
          />
          {/* <ColumnDirective
            field="itineraryCreated" 
            headerText="Trips Created" 
            width="130"
            textAlign="Right"
          /> */}
          <ColumnDirective
            field="status" 
            headerText="Type" 
            width="100"
            textAlign="Center"
            
            template={({status}: UserData) => (
              <article className={cn('status-column', 
                status === 'user'? 'bg-success-50': 'bg-light-300' 
              )}>
                  <div 
                    className={cn('size-1.5 rounded-full', status==='user'? 'bg-success-500': 'bg-gray-500')}
                  />
                  <h3 
                    className={cn('font-inter text-xs font-medium', status === 'user'? 'text-success-700': 'text-gray-500')}
                  >
                    {status}
                  </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  )
}

export default Users