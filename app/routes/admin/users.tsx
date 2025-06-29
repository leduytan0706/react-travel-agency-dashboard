import { Header } from 'components'
import React from 'react'
import {ColumnDirective, ColumnsDirective, GridComponent} from "@syncfusion/ej2-react-grids";
import { users } from '~/constants';
import { cn } from '~/lib/utils';

const Users = () => {
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
                />
                <span>{props.name}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="email" 
            headerText="Email Address" 
            width="150"
            textAlign="Left"
          />
          <ColumnDirective
            field="dateJoined" 
            headerText="Joined At" 
            width="150"
            textAlign="Left"
          />
          <ColumnDirective
            field="itineraryCreated" 
            headerText="Trips Created" 
            width="130"
            textAlign="Right"
          />
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